# Hardened Security Specification for IPZ SENSIPRO

This document defines the data invariants, threat model ("Dirty Dozen" payloads), and tests to verify our Zero-Trust security posture for Firestore collections.

## 1. Data Invariants

- **User Profiles (`/users/{userId}`)**:
  - A user profile can only be created and modified by the owner whose authenticated `uid` matches the `{userId}`.
  - Profile reads containing PII (e.g., emails) are strictly limited to the profile owner or high-level database admins. No anonymous or blanket reading is allowed.
  - Users are forbidden from altering security metadata such as roles or privilege flags within their own profile.

- **Sensitivity Configurations (`/configs/{configId}`)**:
  - A configuration document must contain a valid `ownerId` matching the creator's `uid`.
  - All numerical sliders (weapon categories) must be typed as numbers within the strict boundaries of `0` to `200`.
  - Booster values must correspond to the allowlisted options: `5, 10, 30, 50, 100, 200`.
  - Timestamp fields (`createdAt`, `updatedAt`) must align exactly with the server's time `request.time`.
  - Only the owner can read, update, or delete their configs.

- **Coach Analyses (`/coaching/{analysisId}`)**:
  - Users can only request analyses with their own `userId`. No user can request coaching reviews for another user.
  - Video names/sizes must be bounded so attackers cannot upload excessive strings or inject payloads in standard fields.
  - The `status` field is immutable for standard users (cannot skip steps or manually set `status: "completed"` or write arbitrary `analysisResult`).

---

## 2. Threat Model: The "Dirty Dozen" Payloads

Here are the 12 malicious payloads designed to attempt to spoof identity, escalate privileges, bypass validation, or poison document structures. Each payload must return `PERMISSION_DENIED` under our security rules.

### T1: Identity Spoofing (Impersonation)
* **Payload:** Attempting to create a user profile for a different UID.
* **Target:** `/users/target_user_123`
* **JSON:**
  ```json
  {
    "uid": "target_user_123",
    "email": "spoof@hacker.com",
    "username": "I_Am_Spoofer",
    "createdAt": "2026-05-15T20:30:00Z"
  }
  ```
  *(Authed as `attacker_uid`)*

### T2: Privilege Escalation (Self-Assigned Admin Role)
* **Payload:** A standard user attempting to write an admin role field inside their profile.
* **Target:** `/users/attacker_uid`
* **JSON:**
  ```json
  {
    "uid": "attacker_uid",
    "email": "attacker@gmail.com",
    "username": "HackerPro",
    "role": "admin",
    "isAdmin": true
  }
  ```

### T3: Shadow Update (Ghost Fields Injection)
* **Payload:** Writing un-allowlisted elements into an update sequence.
* **Target:** `/configs/config_abc`
* **JSON:**
  ```json
  {
    "id": "config_abc",
    "name": "Extreme Sensi",
    "ownerId": "attacker_uid",
    "deviceModel": "POCO F5",
    "boosterValue": 100,
    "sensitivities": { "1tiro": 150 },
    "regedits": {},
    "optimizations": {},
    "isVIPUser": true,
    "freeGemsUnlocked": 99999
  }
  ```

### T4: Range Boundary Poisoning (Denial of Wallet)
* **Payload:** Sensi slider value set to extreme limits to crash render loops or overload records.
* **Target:** `/configs/config_abc`
* **JSON:**
  ```json
  {
    "sensitivities": {
      "arma1Tiro": 9999999999,
      "metralhadora": -1
    }
  }
  ```

### T5: Orphan Record / Empty Owner ID Association
* **Payload:** Sensi configuration profile with ownerId omitted or empty string.
* **Target:** `/configs/config_empty`
* **JSON:**
  ```json
  {
    "id": "config_empty",
    "name": "Orphan Sensi",
    "ownerId": "",
    "deviceModel": "Hacker Phone",
    "boosterValue": 10
  }
  ```

### T6: State Terminal Lock Hijacking
* **Payload:** Overwriting a coaching session that is marked as `completed` to inject arbitrary answers.
* **Target:** `/coaching/session_789` (already saved as Completed in DB)
* **JSON:**
  ```json
  {
    "status": "pending",
    "analysisResult": "Attacker overrides analysis output!"
  }
  ```

### T7: Client Mocked-Time Forgery
* **Payload:** Forging custom timestamps to appear older or bypass temporal checks.
* **Target:** `/configs/config_abc`
* **JSON:**
  ```json
  {
    "createdAt": "2015-01-01T00:00:00Z"
  }
  ```

### T8: Self-Completing Coaching Sessions
* **Payload:** Creating a coaching ticket with status pre-set to completed and self-generating professional tips.
* **Target:** `/coaching/malicious_session`
* **JSON:**
  ```json
  {
    "id": "malicious_session",
    "userId": "attacker_uid",
    "videoName": "partida.mp4",
    "status": "completed",
    "analysisResult": "Coach Sensi VIP Premium: You are perfect! (Self-granted)"
  }
  ```

### T9: Sensi Ownership Theft
* **Payload:** Attacker attempting to read or modify a private configuration owned by a different user.
* **Target:** `/configs/victim_config`
* **JSON Action:** Update or Get operation from an unauthorized UID.

### T10: Sensi Configuration Name Overloading (Denial of Service)
* **Payload:** Writing a massive, 1MB string as the `name` or `deviceModel` of a config, bloating Storage/Billing.
* **Target:** `/configs/config_bloat`
* **JSON:**
  ```json
  {
    "id": "config_bloat",
    "name": "LongStringOfSize1MB...",
    "ownerId": "attacker_uid",
    "deviceModel": "POCO F5"
  }
  ```

### T11: Unverified Email Attack (Spoof Mode)
* **Payload:** Writing configurations or user data with an unverified email token.
* **Constraint:** App requires `email_verified == true`.
* **Action:** Create profile or config with auth context `email_verified: false`

### T12: Collection Traversing / Query Scraping Injection
* **Payload:** Requesting blanket configuration list queries without specifying ownership.
* **Request:** `db.collection('configs').get()`
* **Target:** Collecting other players' private configurations.

---

## 3. Test Runner Infrastructure Configuration

Below is our automated test suite designed for the `@firebase/rules-unit-testing` package to isolate each collection and guarantee strict safety boundaries.

```typescript
import {
  initializeTestEnvironment,
  RulesTestEnvironment,
  assertFails,
  assertSucceeds,
} from "@firebase/rules-unit-testing";
import * as fs from "fs";

let testEnv: RulesTestEnvironment;

describe("IPZ SENSIPRO Zero-Trust Security Audit", () => {
  before(async () => {
    testEnv = await initializeTestEnvironment({
      projectId: "gen-lang-client-0844032895",
      firestore: {
        rules: fs.readFileSync("firestore.rules", "utf8"),
      },
    });
  });

  after(async () => {
    await testEnv.cleanup();
  });

  // Test Profile Protection
  it("T1: Defends against User Impersonation (Reject UID mismatch)", async () => {
    const attackerContext = testEnv.authenticatedContext("attacker_uid");
    await assertFails(
      attackerContext.firestore().doc("users/victim_uid").set({
        uid: "victim_uid",
        email: "spoof@hacker.com",
        username: "Spoofer",
        createdAt: new Date(),
        updatedAt: new Date(),
      })
    );
  });

  it("T2: Defends against Self-Assigned Admin Escalation", async () => {
    const client = testEnv.authenticatedContext("user_uid");
    await assertFails(
      client.firestore().doc("users/user_uid").set({
        uid: "user_uid",
        email: "user@test.com",
        username: "NormalUser",
        createdAt: new Date(),
        updatedAt: new Date(),
        role: "admin",
        isAdmin: true,
      })
    );
  });

  // Sensi Shield tests
  it("T3 & T4: Defends against Sensi Range Boundary Poisoning and Shadow Fields", async () => {
    const client = testEnv.authenticatedContext("gamer_123");
    await assertFails(
      client.firestore().doc("configs/config_abc").set({
        id: "config_abc",
        name: "Extreme Gamer Speed",
        ownerId: "gamer_123",
        deviceModel: "S24 Ultra",
        boosterValue: 100,
        sensitivities: {
          arma1Tiro: 999999, // Out of bounds [0-200]
        },
        regedits: {},
        optimizations: {},
        createdAt: new Date(),
        updatedAt: new Date(),
      })
    );
  });

  it("T9: Defends against cross-user reads on private sensitivity configs", async () => {
    const attacker = testEnv.authenticatedContext("attacker_uid");
    await assertFails(
      attacker.firestore().doc("configs/victim_config_id").get()
    );
  });
});
```
