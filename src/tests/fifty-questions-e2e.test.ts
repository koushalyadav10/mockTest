import { describe, it, expect, beforeAll } from "vitest";
import { prisma } from "../lib/db";
import { LocalHeuristicOCRProvider } from "../lib/ai/ocr-provider";
import { DocumentProcessingPipeline } from "../lib/ai/pipeline";

describe("50-Question Examination Paper Full E2E & Boundary Test", () => {
  const samplePaperText = `SSC CHSL Quantitative Aptitude — Set 1
1. If the price of sugar increases by 25%, by what percentage must a household reduce its consumption so that total expenditure remains unchanged?
(A) 15%
(B) 18%
(C) 20%
(D) 25%
(E) None of these  
2. A sum of money doubles itself at simple interest in 8 years. In how many years will it triple itself?
(A) 12 years
(B) 14 years
(C) 16 years
(D) 18 years
(E) 20 years  
3. What is 35% of 400 plus 45% of 240?
(A) 248
(B) 236
(C) 240
(D) 250
(E) 244  
4. A train 180 metres long is running at 72 km/h. How many seconds will it take to pass an electric pole?
(A) 9 seconds
(B) 10 seconds
(C) 8 seconds
(D) 12 seconds
(E) 15 seconds  
5. The average of 5 consecutive odd numbers is 27. What is the largest of these numbers?
(A) 29
(B) 31
(C) 33
(D) 35
(E) 27  
6. A man bought an article for ₹800 and sold it for ₹920. What is his profit percentage?
(A) 10%
(B) 12%
(C) 15%
(D) 18%
(E) 20%  
7. The ratio of two numbers is 3 : 5 and their sum is 64. What is the difference between the numbers?
(A) 12
(B) 14
(C) 16
(D) 18
(E) 20  
8. A number is increased by 20% and then decreased by 20%. What is the net percentage change?
(A) 4% increase
(B) 4% decrease
(C) No change
(D) 2% decrease
(E) 2% increase  
9. Find the simple interest on ₹5,000 at 8% per annum for 3 years.
(A) ₹1,000
(B) ₹1,100
(C) ₹1,200
(D) ₹1,300
(E) ₹1,400  
10. The average of 8 numbers is 24. If one number is removed, the average becomes 22. What is the number removed?
(A) 36
(B) 38
(C) 40
(D) 42
(E) 44  
11. A train travels 360 km in 5 hours. What is its speed in km/h?
(A) 60
(B) 72
(C) 75
(D) 80
(E) 90  
12. If 12 men can complete a work in 15 days, how many days will 20 men take to complete the same work, assuming all men work at the same rate?
(A) 7 days
(B) 8 days
(C) 9 days
(D) 10 days
(E) 12 days  
13. What is 25% of 640?
(A) 120
(B) 140
(C) 150
(D) 160
(E) 180  
14. The HCF of 48 and 72 is:
(A) 12
(B) 18
(C) 24
(D) 36
(E) 48  
15. The LCM of 12, 18 and 24 is:
(A) 36
(B) 48
(C) 60
(D) 72
(E) 96  
16. A shopkeeper allows a discount of 10% on an article marked at ₹1,500. What is the selling price?
(A) ₹1,250
(B) ₹1,300
(C) ₹1,350
(D) ₹1,400
(E) ₹1,450  
17. If x : y = 4 : 7 and y : z = 14 : 15, then x : y : z is:
(A) 4 : 7 : 15
(B) 8 : 14 : 15
(C) 8 : 14 : 30
(D) 4 : 14 : 15
(E) 8 : 7 : 15  
18. A sum of ₹2,000 amounts to ₹2,400 in 4 years at simple interest. What is the rate of interest per annum?
(A) 4%
(B) 5%
(C) 6%
(D) 8%
(E) 10%  
19. If 3x + 5 = 20, then the value of x is:
(A) 3
(B) 4
(C) 5
(D) 6
(E) 7  
20. The perimeter of a rectangle is 60 cm. If its length is 20 cm, what is its breadth?
(A) 8 cm
(B) 10 cm
(C) 12 cm
(D) 15 cm
(E) 20 cm  
21. The area of a square is 144 cm². What is its perimeter?
(A) 36 cm
(B) 40 cm
(C) 44 cm
(D) 48 cm
(E) 52 cm  
22. A sum becomes ₹1,210 in 2 years at 10% compound interest per annum. What was the principal?
(A) ₹900
(B) ₹950
(C) ₹1,000
(D) ₹1,050
(E) ₹1,100  
23. A man can row 12 km downstream in 2 hours and the same distance upstream in 3 hours. What is the speed of the stream?
(A) 1 km/h
(B) 2 km/h
(C) 3 km/h
(D) 4 km/h
(E) 5 km/h  
24. If 40% of a number is 72, what is the number?
(A) 160
(B) 170
(C) 180
(D) 190
(E) 200  
25. A and B can complete a work in 12 days and 18 days respectively. In how many days can they complete the work together?
(A) 6 days
(B) 7.2 days
(C) 8 days
(D) 9 days
(E) 10 days  
26. The cost price of an article is ₹1,200. If it is sold at a loss of 15%, what is its selling price?
(A) ₹980
(B) ₹1,000
(C) ₹1,020
(D) ₹1,050
(E) ₹1,080  
27. The sum of three consecutive integers is 72. What is the largest integer?
(A) 23
(B) 24
(C) 25
(D) 26
(E) 27  
28. A number is divided by 5 and the remainder is 3. Which of the following can be that number?
(A) 25
(B) 28
(C) 30
(D) 35
(E) 40  
29. The angles of a triangle are in the ratio 2 : 3 : 4. What is the largest angle?
(A) 60°
(B) 70°
(C) 80°
(D) 90°
(E) 100°  
30. The radius of a circle is 7 cm. What is its circumference? Take π = 22/7.
(A) 22 cm
(B) 44 cm
(C) 49 cm
(D) 88 cm
(E) 154 cm  
31. If the selling price of an article is ₹900 and the profit is 20%, what is its cost price?
(A) ₹700
(B) ₹720
(C) ₹750
(D) ₹780
(E) ₹800  
32. A person spends 75% of his income. If his income is ₹20,000, how much does he save?
(A) ₹4,000
(B) ₹5,000
(C) ₹6,000
(D) ₹7,500
(E) ₹8,000  
33. The average of 10, 20, 30, 40, and x is 25. What is the value of x?
(A) 15
(B) 20
(C) 25
(D) 30
(E) 35  
34. A car travels at a speed of 60 km/h for 2.5 hours. What distance does it cover?
(A) 120 km
(B) 140 km
(C) 150 km
(D) 160 km
(E) 180 km  
35. What is the compound interest on ₹10,000 at 10% per annum for 2 years compounded annually?
(A) ₹1,900
(B) ₹2,000
(C) ₹2,100
(D) ₹2,200
(E) ₹2,400  
36. If a : b = 2 : 3 and b : c = 5 : 6, what is a : c?
(A) 1 : 2
(B) 5 : 9
(C) 10 : 18
(D) 5 : 8
(E) 2 : 5  
37. A mixture contains milk and water in the ratio 5 : 3. If the total mixture is 32 litres, how much water is present?
(A) 10 litres
(B) 12 litres
(C) 14 litres
(D) 16 litres
(E) 20 litres  
38. What is the value of √144 + √81?
(A) 17
(B) 19
(C) 21
(D) 23
(E) 25  
39. If 2/5 of a number is 48, what is 3/4 of that number?
(A) 72
(B) 80
(C) 90
(D) 100
(E) 120  
40. A boat covers 30 km downstream in 3 hours and the same distance upstream in 5 hours. What is the speed of the boat in still water?
(A) 6 km/h
(B) 7 km/h
(C) 8 km/h
(D) 9 km/h
(E) 10 km/h  
41. The ratio of boys to girls in a class is 3 : 2. If there are 40 students in total, how many are boys?
(A) 20
(B) 22
(C) 24
(D) 25
(E) 28  
42. A sum of ₹8,000 is divided between A and B in the ratio 3 : 5. What amount does B receive?
(A) ₹3,000
(B) ₹4,000
(C) ₹4,500
(D) ₹5,000
(E) ₹5,500  
43. The difference between 40% and 25% of a number is 90. What is the number?
(A) 500
(B) 550
(C) 600
(D) 650
(E) 700  
44. A man covers half of a distance at 40 km/h and the remaining half at 60 km/h. What is his average speed for the entire journey?
(A) 45 km/h
(B) 48 km/h
(C) 50 km/h
(D) 52 km/h
(E) 54 km/h  
45. If the diagonal of a square is 10√2 cm, what is its area?
(A) 50 cm²
(B) 75 cm²
(C) 100 cm²
(D) 125 cm²
(E) 200 cm²  
46. If 15% of a number is 45, what is 40% of that number?
(A) 100
(B) 110
(C) 120
(D) 130
(E) 140  
47. The simple interest on a certain sum for 3 years at 6% per annum is ₹540. What is the principal?
(A) ₹2,500
(B) ₹2,800
(C) ₹3,000
(D) ₹3,200
(E) ₹3,500  
48. A pipe can fill a tank in 20 minutes and another pipe can fill it in 30 minutes. If both pipes are opened together, how many minutes will they take to fill the tank?
(A) 10 minutes
(B) 12 minutes
(C) 15 minutes
(D) 18 minutes
(E) 20 minutes  
49. If the price of an article is reduced by 20%, by what percentage should the reduced price be increased to get the original price?
(A) 20%
(B) 22.5%
(C) 25%
(D) 30%
(E) 33⅓%  
50. A train 150 m long crosses a platform 250 m long in 20 seconds. What is the speed of the train?
(A) 54 km/h
(B) 60 km/h
(C) 72 km/h
(D) 75 km/h
(E) 80 km/h  
Correct Answers
1  2  3  4  5  6  7  8  9  10
C  C  A  A  B  C  C  B  C  C  
11  12  13  14  15  16  17  18  19  20
B  C  D  C  D  C  B  B  C  B  
21  22  23  24  25  26  27  28  29  30
D  C  B  C  B  C  C  B  C  B  
31  32  33  34  35  36  37  38  39  40
C  B  C  C  C  C  B  B  C  C  
41  42  43  44  45  46  47  48  49  50
C  D  C  B  C  B  C  B  C  C`;

  it("extracts all 50 questions with options and answer keys", async () => {
    const provider = new LocalHeuristicOCRProvider();
    const result = await provider.extractQuestions({
      textFallback: samplePaperText,
      fileName: "SSC_CHSL_Quant_Set_1.txt",
      fileType: "text/plain",
    });

    expect(result.questions.length).toBe(50);
    expect(result.document.hasAnswerKey).toBe(true);

    // Verify Question 1
    const q1 = result.questions[0];
    expect(q1.questionNumber).toBe(1);
    expect(q1.options.length).toBe(5);
    expect(q1.sourceAnswer).toBe("C");
    expect(q1.options.find((o) => o.label === "C")?.isCorrect).toBe(true);

    // Verify Question 28 (Edge case: numbers in text 'divided by 5 and remainder is 3')
    const q28 = result.questions[27];
    expect(q28.questionNumber).toBe(28);
    expect(q28.options.length).toBe(5);
    expect(q28.questionText).toContain("A number is divided by 5 and the remainder is 3");
    expect(q28.sourceAnswer).toBe("B");
    expect(q28.options.find((o) => o.label === "B")?.isCorrect).toBe(true);

    // Verify Question 29 (Edge case: ratio '2 : 3 : 4')
    const q29 = result.questions[28];
    expect(q29.questionNumber).toBe(29);
    expect(q29.options.length).toBe(5);
    expect(q29.questionText).toContain("The angles of a triangle are in the ratio 2 : 3 : 4");
    expect(q29.sourceAnswer).toBe("C");
    expect(q29.options.find((o) => o.label === "C")?.isCorrect).toBe(true);

    // Verify Question 50
    const q50 = result.questions[49];
    expect(q50.questionNumber).toBe(50);
    expect(q50.sourceAnswer).toBe("C");
    expect(q50.options.find((o) => o.label === "C")?.isCorrect).toBe(true);
  });

  it("successfully runs the full 15-step pipeline and persists to database", async () => {
    // 1. Create a dummy document record in DB
    const doc = await prisma.uploadedDocument.create({
      data: {
        fileName: "Test_SSC_CHSL_50Q.txt",
        fileType: "text/plain",
        fileSize: samplePaperText.length,
        rawText: samplePaperText,
        status: "UPLOADING",
      },
    });

    // 2. Run the pipeline
    const pipeline = new DocumentProcessingPipeline();
    const result = await pipeline.runPipeline({
      documentId: doc.id,
      fileName: doc.fileName,
      fileType: doc.fileType,
      textFallback: samplePaperText,
    });

    expect(result.questions.length).toBe(50);

    // 3. Verify in database
    const dbDoc = await prisma.uploadedDocument.findUnique({
      where: { id: doc.id },
      include: { questions: { include: { options: true } } },
    });

    expect(dbDoc?.status).toBe("COMPLETED");
    expect(dbDoc?.questions.length).toBe(50);

    // Cleanup
    await prisma.question.deleteMany({ where: { documentId: doc.id } });
    await prisma.uploadedDocument.delete({ where: { id: doc.id } });
  }, 30000);
});
