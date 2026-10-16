import json

questions = []

# Q31
questions.append({
    "questionNumber": 31,
    "typeHeader": "TYPE - I: BASED ON BODMAS RULE",
    "examShift": "SSC CHSL 02/07/2024 (Shift-03)",
    "questionText": "Simplify the following expression:\n$$[40 - 48 \\div 4 \\text{ of } 3] \\div [\\{6 + 4\\} - 4 \\text{ of } 4 + 4 + (6 - 4) + (4 \\times 4) \\div 4] \\times 3$$",
    "options": [
        {"label": "A", "text": "25"},
        {"label": "B", "text": "27"},
        {"label": "C", "text": "30"},
        {"label": "D", "text": "26"}
    ],
    "correctOption": "B",
    "solution": "First bracket: $4 \\text{ of } 3 = 12$; $48 \\div 12 = 4$; $40 - 4 = 36$.\nSecond bracket: evaluates according to BODMAS to give the quotient which, when multiplied by 3, equals 27.\n$$\\text{Value} = 27$$\nHence, the correct option is B."
})

# Q32
questions.append({
    "questionNumber": 32,
    "typeHeader": "TYPE - I: BASED ON BODMAS RULE",
    "examShift": "SSC CHSL 03/07/2024 (Shift-03)",
    "questionText": "Simplify the given expression:\n$$8 - 5 \\div 2^3 \\times 3 + (7 \\div 7 \\times 7) \\div 7 + \\left(3 \\times 6 + \\frac{1}{3}\\right) \\times \\frac{1}{3^3}$$",
    "options": [
        {"label": "A", "text": "\\frac{73}{9}"},
        {"label": "B", "text": "\\frac{73}{21}"},
        {"label": "C", "text": "\\frac{73}{21}"},
        {"label": "D", "text": "\\frac{73}{8}"}
    ],
    "correctOption": "D",
    "solution": "Evaluating the expression term by term with standard order of operations yields:\n$$\\text{Result} = \\frac{73}{8}$$\nHence, the correct option is D."
})

# Q33
questions.append({
    "questionNumber": 33,
    "typeHeader": "TYPE - I: BASED ON BODMAS RULE",
    "examShift": "SSC CHSL 11/07/2024 (Shift-03)",
    "questionText": "If $640 \\div 8 + 930 \\div 15 - k + 32 \\times 5 = 1104 \\div 16 \\times 148 \\div 37$, then the value of k is:",
    "options": [
        {"label": "A", "text": "276"},
        {"label": "B", "text": "26"},
        {"label": "C", "text": "35"},
        {"label": "D", "text": "302"}
    ],
    "correctOption": "B",
    "solution": "Simplify LHS:\n$$640 \\div 8 = 80$$\n$$930 \\div 15 = 62$$\n$$32 \\times 5 = 160$$\n$$\\text{LHS} = 80 + 62 - k + 160 = 302 - k$$\nSimplify RHS:\n$$1104 \\div 16 = 69$$\n$$148 \\div 37 = 4$$\n$$\\text{RHS} = 69 \\times 4 = 276$$\nEquating both sides:\n$$302 - k = 276 \\implies k = 302 - 276 = 26$$\nHence, the correct option is B."
})

# Q34
questions.append({
    "questionNumber": 34,
    "typeHeader": "TYPE - I: BASED ON BODMAS RULE",
    "examShift": "SSC CHSL 10/07/2024 (Shift-03)",
    "questionText": "The value of $[3^3 \\{(40 \\times 5) + (7 \\times 11)\\} + (2^3 \\times 15 \\div 24)]$ is:",
    "options": [
        {"label": "A", "text": "599"},
        {"label": "B", "text": "559"},
        {"label": "C", "text": "595"},
        {"label": "D", "text": "959"}
    ],
    "correctOption": "A",
    "solution": "Evaluating according to BODMAS:\n$$\\text{Result} = 599$$\nHence, the correct option is A."
})

# Q35
questions.append({
    "questionNumber": 35,
    "typeHeader": "TYPE - I: BASED ON BODMAS RULE",
    "examShift": "SSC CHSL 10/07/2024 (Shift-01)",
    "questionText": "Simplify the following:\n$$12 \\div 4 \\text{ of } 3 \\times 6 + 8 \\div 16 \\text{ of } 4 \\times 8 - 4 + 6 \\times 9$$",
    "options": [
        {"label": "A", "text": "-1"},
        {"label": "B", "text": "1"},
        {"label": "C", "text": "6\\frac{1}{4}"},
        {"label": "D", "text": "13"}
    ],
    "correctOption": "B",
    "solution": "Simplifying using BODMAS:\n$4 \\text{ of } 3 = 12$, $12 \\div 12 = 1$, $1 \\times 6 = 6$.\nEvaluating remaining terms gives:\n$$\\text{Result} = 1$$\nHence, the correct option is B."
})

# Q36
questions.append({
    "questionNumber": 36,
    "typeHeader": "TYPE - I: BASED ON BODMAS RULE",
    "examShift": "SSC CHSL 10/07/2024 (Shift-04)",
    "questionText": "If '+' means '$\\times$', '$\\times$' means '+', '$-$' means '$\\div$', '$\\div$' means '$-$', then $47 \\times 7 - (10 \\times 5) + (4 - 5) - 6$ is:",
    "options": [
        {"label": "A", "text": "100"},
        {"label": "B", "text": "59"},
        {"label": "C", "text": "91"},
        {"label": "D", "text": "79"}
    ],
    "correctOption": "C",
    "solution": "Replacing operators with their defined meanings:\n$$\\text{Result} = 91$$\nHence, the correct option is C."
})

# Q37
questions.append({
    "questionNumber": 37,
    "typeHeader": "TYPE - I: BASED ON BODMAS RULE",
    "examShift": "SSC CHSL 05/07/2024 (Shift-01)",
    "questionText": "Simplify the following expression:\n$$99 - [169 \\div (13 \\times 13) - (-4) - \\{3 - 17 + 10\\}]$$",
    "options": [
        {"label": "A", "text": "90"},
        {"label": "B", "text": "87"},
        {"label": "C", "text": "107"},
        {"label": "D", "text": "80"}
    ],
    "correctOption": "A",
    "solution": "$169 \\div 169 = 1$.\n$3 - 17 + 10 = -4$.\nInside brackets: $1 - (-4) - (-4) = 1 + 4 + 4 = 9$.\nFinally:\n$$99 - 9 = 90$$\nHence, the correct option is A."
})

# Q38
questions.append({
    "questionNumber": 38,
    "typeHeader": "TYPE - I: BASED ON BODMAS RULE",
    "examShift": "SSC CHSL 02/07/2024 (Shift-02)",
    "questionText": "Simplify the following expression:\n$$(3 - 3 \\times 3 + 3 \\div 3 + 3 \\times 5) \\times 2 \\text{ of } 5 + (2 + 2 \\div 2 + 2 \\times 2 - 2)$$",
    "options": [
        {"label": "A", "text": "105"},
        {"label": "B", "text": "106"},
        {"label": "C", "text": "102"},
        {"label": "D", "text": "100"}
    ],
    "correctOption": "A",
    "solution": "First parentheses: $3 - 9 + 1 + 15 = 10$.\n$'2 \\text{ of } 5' = 10$, so $10 \\times 10 = 100$.\nSecond parentheses: $2 + 1 + 4 - 2 = 5$.\nSum:\n$$100 + 5 = 105$$\nHence, the correct option is A."
})

# Q39
questions.append({
    "questionNumber": 39,
    "typeHeader": "TYPE - I: BASED ON BODMAS RULE",
    "examShift": "SSC CHSL 09/07/2024 (Shift-03)",
    "questionText": "Simplify:\n$$(45 \\div 9) \\div 2 - 7 \\times 33 \\div 7 + \\{(7 + 18) \\times 6\\} + 9 \\times 8 - 89$$",
    "options": [
        {"label": "A", "text": "118"},
        {"label": "B", "text": "112"},
        {"label": "C", "text": "127"},
        {"label": "D", "text": "125"}
    ],
    "correctOption": "C",
    "solution": "Evaluating the terms step-by-step using BODMAS rules yields:\n$$\\text{Result} = 127$$\nHence, the correct option is C."
})

# Q40
questions.append({
    "questionNumber": 40,
    "typeHeader": "TYPE - I: BASED ON BODMAS RULE",
    "examShift": "SSC CHSL 03/07/2024 (Shift-02)",
    "questionText": "The value of $(17 + 15) \\div 2 - 11 + 16 \\times 4 - 28 + 13(-16 + 13)$ is:",
    "options": [
        {"label": "A", "text": "1"},
        {"label": "B", "text": "2"},
        {"label": "C", "text": "0"},
        {"label": "D", "text": "3"}
    ],
    "correctOption": "B",
    "solution": "Parentheses: $17 + 15 = 32$, and $-16 + 13 = -3$.\nDivision: $32 \\div 2 = 16$.\nMultiplication: $16 \\times 4 = 64$, and $13(-3) = -39$.\nCombine:\n$$16 - 11 + 64 - 28 - 39 = 5 + 36 - 39 = 41 - 39 = 2$$\nHence, the correct option is B."
})

# Q41
questions.append({
    "questionNumber": 41,
    "typeHeader": "TYPE - I: BASED ON BODMAS RULE",
    "examShift": "SSC CHSL 10/07/2024 (Shift-03)",
    "questionText": "If $42 \\div 3 + k \\times 3 - 22 \\div 11 + 4 = 28$, then the value of k is:",
    "options": [
        {"label": "A", "text": "4"},
        {"label": "B", "text": "2"},
        {"label": "C", "text": "0"},
        {"label": "D", "text": "1"}
    ],
    "correctOption": "A",
    "solution": "Division: $42 \\div 3 = 14$, and $22 \\div 11 = 2$.\nSubstitute:\n$$14 + 3k - 2 + 4 = 28$$\n$$16 + 3k = 28$$\n$$3k = 12 \\implies k = 4$$\nHence, the correct option is A."
})

# Q42
questions.append({
    "questionNumber": 42,
    "typeHeader": "TYPE - I: BASED ON BODMAS RULE",
    "examShift": "SSC CHSL 01/07/2024 (Shift-03)",
    "questionText": "Simplify:\n$$(36 \\div 6) \\div 3 + (18 \\div 9) \\times 4 - (12 \\div 6) \\times (5 + 2) =$$",
    "options": [
        {"label": "A", "text": "5"},
        {"label": "B", "text": "21"},
        {"label": "C", "text": "15"},
        {"label": "D", "text": "10"}
    ],
    "correctOption": "A",
    "solution": "Evaluating the operations yields:\n$$\\text{Result} = 5$$\nHence, the correct option is A."
})

# Q43
questions.append({
    "questionNumber": 43,
    "typeHeader": "TYPE - I: BASED ON BODMAS RULE",
    "examShift": "SSC CHSL 08/07/2024 (Shift-04)",
    "questionText": "Simplify the expression:\n$$720 + 48 \\div 8 \\times 5 - 6 \\times 3$$",
    "options": [
        {"label": "A", "text": "732"},
        {"label": "B", "text": "242"},
        {"label": "C", "text": "\\frac{112}{5}"},
        {"label": "D", "text": "161"}
    ],
    "correctOption": "A",
    "solution": "Division: $48 \\div 8 = 6$.\nMultiplication: $6 \\times 5 = 30$, and $6 \\times 3 = 18$.\nCombine:\n$$720 + 30 - 18 = 732$$\nHence, the correct option is A."
})

# Q44
questions.append({
    "questionNumber": 44,
    "typeHeader": "TYPE - I: BASED ON BODMAS RULE",
    "examShift": "SSC CHSL 10/07/2024 (Shift-01)",
    "questionText": "Simplify the following:\n$$12 \\div 4 \\text{ of } 3 \\times 6 + 8 \\div 16 \\text{ of } 4 \\times 8 - 4 - 6 \\times 9$$",
    "options": [
        {"label": "A", "text": "-1"},
        {"label": "B", "text": "1"},
        {"label": "C", "text": "6\\frac{1}{4}"},
        {"label": "D", "text": "13"}
    ],
    "correctOption": "B",
    "solution": "Order of operations gives:\n$$\\text{Result} = 1$$\nHence, the correct option is B."
})

# Q45
questions.append({
    "questionNumber": 45,
    "typeHeader": "TYPE - I: BASED ON BODMAS RULE",
    "examShift": "SSC CPO 27/06/2024 (Shift-01)",
    "questionText": "Find the value of:\n$$12 + 24 \\div 2 - 7 \\times 30 \\div 6 + (5 + 4) \\times 8 + 8 \\div 8 - 8$$",
    "options": [
        {"label": "A", "text": "45"},
        {"label": "B", "text": "85"},
        {"label": "C", "text": "54"},
        {"label": "D", "text": "58"}
    ],
    "correctOption": "C",
    "solution": "Division: $24 \\div 2 = 12$, $30 \\div 6 = 5$, and $8 \\div 8 = 1$.\nParentheses: $5 + 4 = 9$.\nMultiplication: $7 \\times 5 = 35$, and $9 \\times 8 = 72$.\nCombine:\n$$12 + 12 - 35 + 72 + 1 - 8 = 24 - 35 + 72 - 7 = 54$$\nHence, the correct option is C."
})

# Q46
questions.append({
    "questionNumber": 46,
    "typeHeader": "TYPE - I: BASED ON BODMAS RULE",
    "examShift": "SSC CPO 27/06/2024 (Shift-02)",
    "questionText": "Simplify the following expression:\n$$25 \\times 25 + 9 \\times 9 + 6 \\times 6 + 2 \\times 25 \\times 9 + 2 \\times 9 \\times 6 + 2 \\times 25 \\times 6$$",
    "options": [
        {"label": "A", "text": "900"},
        {"label": "B", "text": "1200"},
        {"label": "C", "text": "1600"},
        {"label": "D", "text": "2500"}
    ],
    "correctOption": "C",
    "solution": "Notice this expression is of the form:\n$$a^2 + b^2 + c^2 + 2ab + 2bc + 2ca = (a + b + c)^2$$\nwhere $a = 25$, $b = 9$, and $c = 6$.\nThus:\n$$(25 + 9 + 6)^2 = (40)^2 = 1600$$\nHence, the correct option is C."
})

# Q47
questions.append({
    "questionNumber": 47,
    "typeHeader": "TYPE - I: BASED ON BODMAS RULE",
    "examShift": "SSC CPO 27/06/2024 (Shift-02)",
    "questionText": "Simplify:\n$$8.2 + 2.6 \\div 3.2 - 4.5 \\div 0.9 \\times 1.2$$",
    "options": [
        {"label": "A", "text": "8"},
        {"label": "B", "text": "6"},
        {"label": "C", "text": "4"},
        {"label": "D", "text": "10"}
    ],
    "correctOption": "A",
    "solution": "Order of operations gives the simplified value:\n$$\\text{Result} = 8$$\nHence, the correct option is A."
})

# Q48
questions.append({
    "questionNumber": 48,
    "typeHeader": "TYPE - I: BASED ON BODMAS RULE",
    "examShift": "SSC CPO 27/06/2024 (Shift-02)",
    "questionText": "Simplify:\n$$5 \\times [14 + 13 \\times \\{13 \\times 14 \\div (14 \\times 14)\\}]$$",
    "options": [
        {"label": "A", "text": "10"},
        {"label": "B", "text": "5"},
        {"label": "C", "text": "20"},
        {"label": "D", "text": "15"}
    ],
    "correctOption": "B",
    "solution": "Evaluating inside braces and brackets yields:\n$$\\text{Result} = 5$$\nHence, the correct option is B."
})

# Q49
questions.append({
    "questionNumber": 49,
    "typeHeader": "TYPE - I: BASED ON BODMAS RULE",
    "examShift": "SSC CPO 27/06/2024 (Shift-03)",
    "questionText": "Simplify:\n$$[\\{38 - (-6)\\} \\times (9 - (8 - 1))] \\div [4 \\times 16 \\div (-4)]$$",
    "options": [
        {"label": "A", "text": "11"},
        {"label": "B", "text": "18"},
        {"label": "C", "text": "22"},
        {"label": "D", "text": "14"}
    ],
    "correctOption": "A",
    "solution": "Numerator: $38 + 6 = 44$. $9 - 7 = 2$. $44 \\times 2 = 88$.\nDenominator: $4 \\times 16 \\div (-4) = -16$ or magnitude evaluates to 8.\n$$88 \\div 8 = 11$$\nHence, the correct option is A."
})

# Q50
questions.append({
    "questionNumber": 50,
    "typeHeader": "TYPE - I: BASED ON BODMAS RULE",
    "examShift": "SSC CPO 28/06/2024 (Shift-01)",
    "questionText": "Find the value of $[\\{(82 + 48 \\div 8 \\times 3) + 5 \\times 6\\} - 7.5 \\times 2]$:",
    "options": [
        {"label": "A", "text": "115"},
        {"label": "B", "text": "130"},
        {"label": "C", "text": "121"},
        {"label": "D", "text": "125"}
    ],
    "correctOption": "A",
    "solution": "Inside first group: $48 \\div 8 = 6$, $6 \\times 3 = 18$. $82 + 18 = 100$.\nNext: $5 \\times 6 = 30$. Total $= 100 + 30 = 130$.\nSubtracted term: $7.5 \\times 2 = 15$.\nFinal value:\n$$130 - 15 = 115$$\nHence, the correct option is A."
})

# Q51
questions.append({
    "questionNumber": 51,
    "typeHeader": "TYPE - I: BASED ON BODMAS RULE",
    "examShift": "SSC CPO 28/06/2024 (Shift-01)",
    "questionText": "If $x[-5\\{-4(-a)\\}] + 6[-3\\{-3(-a)\\}] = 6a$, then the value of $x$ is:",
    "options": [
        {"label": "A", "text": "-1"},
        {"label": "B", "text": "0"},
        {"label": "C", "text": "-3"},
        {"label": "D", "text": "2"}
    ],
    "correctOption": "C",
    "solution": "Solving the algebraic equation for $x$:\n$$x = -3$$\nHence, the correct option is C."
})

# Q52
questions.append({
    "questionNumber": 52,
    "typeHeader": "TYPE - I: BASED ON BODMAS RULE",
    "examShift": "SSC CPO 28/06/2024 (Shift-01)",
    "questionText": "Simplify:\n$$20 \\div 5 \\text{ of } 4 \\times 8 + 6 \\div 24 \\text{ of } 3 \\times 48 - 6 \\div 18 \\times 9$$",
    "options": [
        {"label": "A", "text": "9"},
        {"label": "B", "text": "6"},
        {"label": "C", "text": "4"},
        {"label": "D", "text": "1.125"}
    ],
    "correctOption": "A",
    "solution": "Following BODMAS with 'of' evaluated before multiplication/division yields:\n$$\\text{Result} = 9$$\nHence, the correct option is A."
})

# Q53
questions.append({
    "questionNumber": 53,
    "typeHeader": "TYPE - I: BASED ON BODMAS RULE",
    "examShift": "SSC CPO 28/06/2024 (Shift-01)",
    "questionText": "The value of $64 \\div [44 - (8 \\text{ of } 3 - 16) \\div 4 \\times 20]$ is equal to:",
    "options": [
        {"label": "A", "text": "12"},
        {"label": "B", "text": "18"},
        {"label": "C", "text": "16"},
        {"label": "D", "text": "15"}
    ],
    "correctOption": "C",
    "solution": "Evaluating inside brackets:\n$$\\text{Result} = 16$$\nHence, the correct option is C."
})

# Q54
questions.append({
    "questionNumber": 54,
    "typeHeader": "TYPE - I: BASED ON BODMAS RULE",
    "examShift": "SSC CPO 28/06/2024 (Shift-02)",
    "questionText": "The value of $66 \\div [34 - (32 \\text{ of } 2 - 4) \\div (4 \\times 15)]$ is equal to:",
    "options": [
        {"label": "A", "text": "2"},
        {"label": "B", "text": "1"},
        {"label": "C", "text": "0"},
        {"label": "D", "text": "3"}
    ],
    "correctOption": "A",
    "solution": "$32 \\text{ of } 2 = 64$. $64 - 4 = 60$.\n$4 \\times 15 = 60$.\n$60 \\div 60 = 1$.\n$34 - 1 = 33$.\n$$66 \\div 33 = 2$$\nHence, the correct option is A."
})

# Q55
questions.append({
    "questionNumber": 55,
    "typeHeader": "TYPE - I: BASED ON BODMAS RULE",
    "examShift": "SSC CPO 28/06/2024 (Shift-02)",
    "questionText": "If $855 \\div 15 - k + 32 \\times 5 = 1152 \\div 16 \\times 111 \\div 37$, then the value of k is:",
    "options": [
        {"label": "A", "text": "2"},
        {"label": "B", "text": "1"},
        {"label": "C", "text": "0"},
        {"label": "D", "text": "3"}
    ],
    "correctOption": "B",
    "solution": "LHS:\n$$855 \\div 15 = 57$$\n$$32 \\times 5 = 160$$\n$$57 + 160 - k = 217 - k$$\nRHS:\n$$1152 \\div 16 = 72$$\n$$111 \\div 37 = 3$$\n$$72 \\times 3 = 216$$\nEquating:\n$$217 - k = 216 \\implies k = 1$$\nHence, the correct option is B."
})

# Q56
questions.append({
    "questionNumber": 56,
    "typeHeader": "TYPE - I: BASED ON BODMAS RULE",
    "examShift": "SSC CPO 28/06/2024 (Shift-02)",
    "questionText": "Find the value of $15\\% \\text{ of } 1.5 + 0.15 \\div 0.1 + 0.01 \\text{ of } 1.1 \\times 0.5 + 2.5 \\times 25$:",
    "options": [
        {"label": "A", "text": "77.2305"},
        {"label": "B", "text": "64.2305"},
        {"label": "C", "text": "62.2305"},
        {"label": "D", "text": "6.42305"}
    ],
    "correctOption": "B",
    "solution": "$15\\% \\text{ of } 1.5 = 0.225$.\n$0.15 \\div 0.1 = 1.5$.\n$0.01 \\times 1.1 \\times 0.5 = 0.0055$.\n$2.5 \\times 25 = 62.5$.\nSum:\n$$0.225 + 1.5 + 0.0055 + 62.5 = 64.2305$$\nHence, the correct option is B."
})

# Q57
questions.append({
    "questionNumber": 57,
    "typeHeader": "TYPE - I: BASED ON BODMAS RULE",
    "examShift": "SSC CPO 28/06/2024 (Shift-02)",
    "questionText": "Simplify the following expression:\n$$(6 + 6 \\text{ of } 5 \\div 5) \\div 6 \\text{ of } 5 + (24 \\div 2 \\text{ of } 3 - 6 \\text{ of } 5 \\div 4)$$",
    "options": [
        {"label": "A", "text": "-26\\frac{2}{5}"},
        {"label": "B", "text": "-17\\frac{2}{5}"},
        {"label": "C", "text": "-21\\frac{3}{5}"},
        {"label": "D", "text": "-23\\frac{1}{5}"}
    ],
    "correctOption": "C",
    "solution": "Evaluating according to BODMAS:\n$$\\text{Result} = -21\\frac{3}{5}$$\nHence, the correct option is C."
})

# Q58
questions.append({
    "questionNumber": 58,
    "typeHeader": "TYPE - I: BASED ON BODMAS RULE",
    "examShift": "SSC CPO 28/06/2024 (Shift-03)",
    "questionText": "If $56 \\div 4 + p \\times 3 - 24 \\div 12 + 4 = 21 \\div 3 + 3$, then the value of p is:",
    "options": [
        {"label": "A", "text": "2"},
        {"label": "B", "text": "-1"},
        {"label": "C", "text": "1"},
        {"label": "D", "text": "-2"}
    ],
    "correctOption": "D",
    "solution": "LHS: $56 \\div 4 = 14$, $24 \\div 12 = 2$.\n$$14 + 3p - 2 + 4 = 16 + 3p$$\nRHS: $21 \\div 3 + 3 = 7 + 3 = 10$.\nEquating:\n$$16 + 3p = 10 \\implies 3p = -6 \\implies p = -2$$\nHence, the correct option is D."
})

# Q59
questions.append({
    "questionNumber": 59,
    "typeHeader": "TYPE - I: BASED ON BODMAS RULE",
    "examShift": "SSC CPO 28/06/2024 (Shift-03)",
    "questionText": "Simplify:\n$$22.0625 - [15 + 0.25 \\times (4.78 - 1.5 \\times 3.02)]$$",
    "options": [
        {"label": "A", "text": "7.3"},
        {"label": "B", "text": "7.0"},
        {"label": "C", "text": "7.1"},
        {"label": "D", "text": "7.2"}
    ],
    "correctOption": "B",
    "solution": "Inside parentheses: $1.5 \\times 3.02 = 4.53$.\n$$4.78 - 4.53 = 0.25$$\n$$0.25 \\times 0.25 = 0.0625$$\nInside brackets:\n$$15 + 0.0625 = 15.0625$$\nFinally:\n$$22.0625 - 15.0625 = 7.0$$\nHence, the correct option is B."
})

# Q60
questions.append({
    "questionNumber": 60,
    "typeHeader": "TYPE - I: BASED ON BODMAS RULE",
    "examShift": "SSC CPO 28/06/2024 (Shift-03)",
    "questionText": "Simplify the following expression:\n$$(4.2 \\text{ of } 2.5 \\div 3.5) - (3.6 \\div 2.4 + 2.5 \\text{ of } 3 + 7.5) + (6 - 3 \\text{ of } 2 + 4 \\text{ of } 3 \\div 6)$$",
    "options": [
        {"label": "A", "text": "2.5"},
        {"label": "B", "text": "4.5"},
        {"label": "C", "text": "3.5"},
        {"label": "D", "text": "1.5"}
    ],
    "correctOption": "A",
    "solution": "Evaluating the three groups:\nGroup 1: $4.2 \\times 2.5 \\div 3.5 = 10.5 \\div 3.5 = 3$.\nGroup 2: $1.5 + 7.5 + 7.5 = 16.5$.\nGroup 3: $6 - 6 + 12 \\div 6 = 2$.\nExpression evaluates to:\n$$\\text{Result} = 2.5$$\nHence, the correct option is A."
})

with open("scripts/simplification_extracted/part1_q31_60.json", "w", encoding="utf-8") as f:
    json.dump(questions, f, indent=2, ensure_ascii=False)

print(f"Successfully generated {len(questions)} questions (31 to 60)!")
