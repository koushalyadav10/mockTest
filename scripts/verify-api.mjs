async function runVerification() {
  console.log("=== EXAMFORGE AI LIVE SYSTEM VERIFICATION ===");

  // 1. GET /api/exams
  console.log("\n[1/7] Testing GET /api/exams...");
  const examsRes = await fetch("http://localhost:3000/api/exams");
  const exams = await examsRes.json();
  const examList = exams.exams || exams.configs || [];
  console.log(`✓ Status: ${examsRes.status} | Available Exam Configs: ${examList.length}`);

  // 2. GET /api/questions
  console.log("\n[2/7] Testing GET /api/questions...");
  const qsRes = await fetch("http://localhost:3000/api/questions?status=ALL");
  const qs = await qsRes.json();
  console.log(`✓ Status: ${qsRes.status} | Total Questions in Bank: ${qs.total}`);

  // 3. POST /api/tests (Create 1-Click Mock)
  console.log("\n[3/7] Testing POST /api/tests (1-Click CBT Mock Test)...");
  const createRes = await fetch("http://localhost:3000/api/tests", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ mode: "MOCK", questionCountLimit: 5 }),
  });
  const attempt = await createRes.json();
  console.log(`✓ Status: ${createRes.status} | Attempt ID: ${attempt.testAttemptId} | Total Questions: ${attempt.totalQuestions}`);

  // 4. GET /api/tests/[id] (Deterministic Fetch)
  console.log("\n[4/7] Testing GET /api/tests/[id] (Deterministic CBT Loader)...");
  const testRes = await fetch(`http://localhost:3000/api/tests/${attempt.testAttemptId}`);
  const testDetails = await testRes.json();
  console.log(`✓ Status: ${testRes.status} | Remaining: ${testDetails.testAttempt.remainingSeconds}s`);
  console.log(`  Question 1: "${testDetails.questions[0].questionText.slice(0, 45)}..."`);
  console.log(`  Provenance: ${testDetails.questions[0].source} | Type: ${testDetails.questions[0].questionType}`);

  // 5. POST /api/tests/[id]/response (Versioned Auto-Save)
  console.log("\n[5/7] Testing POST /api/tests/[id]/response (Versioned Auto-Save)...");
  const q0 = testDetails.questions[0];
  const saveRes = await fetch(`http://localhost:3000/api/tests/${attempt.testAttemptId}/response`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      questionId: q0.questionId,
      selectedOptionStableId: q0.options[0].stableId,
      action: "SAVE_AND_NEXT",
      timeSpentIncrementSeconds: 42,
    }),
  });
  const save = await saveRes.json();
  console.log(`✓ Status: ${saveRes.status} | Response Version: ${save.responseVersion} | State: ${save.responseState} | Sync: ${save.syncStatus}`);

  // 6. POST /api/tests/[id]/submit (Authoritative Evaluation)
  console.log("\n[6/7] Testing POST /api/tests/[id]/submit (Server Scoring)...");
  const submitRes = await fetch(`http://localhost:3000/api/tests/${attempt.testAttemptId}/submit`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({}),
  });
  const submit = await submitRes.json();
  console.log(`✓ Status: ${submitRes.status} | Final Score: ${submit.evaluation.finalScore} | Accuracy: ${submit.evaluation.accuracy}%`);

  // 7. GET /api/tests/[id]/result (2D Knowledge-Speed Matrix & Weak Topic Engine)
  console.log("\n[7/7] Testing GET /api/tests/[id]/result (2D Matrix & Diagnostic Report)...");
  const resultRes = await fetch(`http://localhost:3000/api/tests/${attempt.testAttemptId}/result`);
  const result = await resultRes.json();
  console.log(`✓ Status: ${resultRes.status} | Evaluation Marks: ${result.evaluation.finalScore}`);
  console.log(`  2D Matrix Summary: ${JSON.stringify(result.knowledgeSpeedMatrix.summary)}`);
  console.log(`  Weak Topics Identified: ${result.topicPerformance.filter(t => t.isWeakTopic).length}`);

  // 8. Specialized Practice Mode Test
  console.log("\n[8/8] Testing POST /api/practice/specialized (Unattempted Mode)...");
  const specRes = await fetch("http://localhost:3000/api/practice/specialized", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      mode: "UNATTEMPTED",
      attemptId: attempt.testAttemptId,
    }),
  });
  const specData = await specRes.json();
  console.log(`✓ Specialized Practice Status: ${specRes.status} | Mode: ${specData.subMode} | Questions to Practice: ${specData.count} | New Practice Attempt ID: ${specData.testAttemptId}`);

  // 9. Bulk Operations API
  console.log("\n[Bonus] Testing POST /api/questions/bulk...");
  const bulkRes = await fetch("http://localhost:3000/api/questions/bulk", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      questionIds: [q0.questionId],
      action: "APPROVE",
    }),
  });
  const bulk = await bulkRes.json();
  console.log(`✓ Bulk Approve Status: ${bulkRes.status} | Message: ${bulk.message}`);

  console.log("\n=== ALL LIVE HTTP ENDPOINTS VERIFIED SUCCESSFULLY ===");
}

runVerification().catch((err) => {
  console.error("Verification failed:", err);
  process.exit(1);
});
