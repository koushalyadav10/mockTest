import json

questions = [
    {
        "questionNumber": 151,
        "typeHeader": "TYPE - IV: DIVISIBILITY",
        "examShift": "SSC CGL 27/07/2023 (Shift-01)",
        "questionText": "If the 9-digit number $9m2365n48$ is divisible by 88, then what is the value of $(m^2 \\times n^2)$ for the minimum value of $n$?",
        "options": [
            {"label": "A", "text": "36"},
            {"label": "B", "text": "64"},
            {"label": "C", "text": "81"},
            {"label": "D", "text": "100"}
        ],
        "correctOption": "B",
        "solution": "$88 = 8 \\times 11$.\n1. Last 3 digits $n48$ divisible by 8: smallest value of $n$ is $2$ ($248 \\div 8 = 31$).\n2. Divisibility by 11:\nSum of odd place digits $= 8 + n + 6 + 2 + 9 = 8 + 2 + 6 + 2 + 9 = 27$.\nSum of even place digits $= 4 + 5 + 3 + m = 12 + m$.\nDifference $= 27 - (12 + m) = 15 - m = 11 \\implies m = 4$.\nNow, $m^2 \\times n^2 = 4^2 \\times 2^2 = 16 \\times 4 = 64$."
    },
    {
        "questionNumber": 152,
        "typeHeader": "TYPE - IV: DIVISIBILITY",
        "examShift": "SSC CHSL 14/03/2023 (Shift-04)",
        "questionText": "Which of the following numbers is divisible by 22?",
        "options": [
            {"label": "A", "text": "234651"},
            {"label": "B", "text": "234653"},
            {"label": "C", "text": "234652"},
            {"label": "D", "text": "234654"}
        ],
        "correctOption": "C",
        "solution": "$22 = 2 \\times 11$.\nA number is divisible by 22 if it is even and divisible by 11.\nChecking Option C (234652):\n1. It ends in 2, so it is even (divisible by 2).\n2. Divisibility by 11:\nSum of odd place digits $= 2 + 6 + 3 = 11$.\nSum of even place digits $= 5 + 4 + 2 = 11$.\nDifference $= 11 - 11 = 0$ (divisible by 11).\nHence, 234652 is divisible by 22."
    },
    {
        "questionNumber": 153,
        "typeHeader": "TYPE - IV: DIVISIBILITY",
        "examShift": "SSC CGL 25/07/2023 (Shift-02)",
        "questionText": "If the 5-digit number $3426k$ is divisible by 6 but NOT by 5, then what is the value of $k$?",
        "options": [
            {"label": "A", "text": "6"},
            {"label": "B", "text": "0"},
            {"label": "C", "text": "2"},
            {"label": "D", "text": "4"}
        ],
        "correctOption": "A",
        "solution": "1. Not divisible by 5 $\\implies k \\neq 0$ and $k \\neq 5$.\n2. Divisible by 6 means divisible by 2 and 3 $\\implies k$ must be even: $k \\in \\{2, 4, 6, 8\\}$.\n3. Divisible by 3: Sum of digits $= 3 + 4 + 2 + 6 + k = 15 + k$.\nFor $(15 + k)$ to be a multiple of 3, $k \\in \\{0, 3, 6, 9\\}$.\nThe only even value not equal to 0 is $k = 6$."
    },
    {
        "questionNumber": 154,
        "typeHeader": "TYPE - IV: DIVISIBILITY",
        "examShift": "SSC MTS 16/05/2023 (Shift-03)",
        "questionText": "If the three-digit number $k36$ is divisible by 8, then what is the sum of the minimum and maximum possible values of $k$?",
        "options": [
            {"label": "A", "text": "10"},
            {"label": "B", "text": "8"},
            {"label": "C", "text": "12"},
            {"label": "D", "text": "14"}
        ],
        "correctOption": "A",
        "solution": "Testing values of $k$ from 1 to 9 for $k36$ divisible by 8:\n- $k = 1: 136 \\div 8 = 17$ (minimum value $= 1$)\n- $k = 5: 536 \\div 8 = 67$\n- $k = 9: 936 \\div 8 = 117$ (maximum value $= 9$)\nSum of minimum and maximum values $= 1 + 9 = 10$."
    },
    {
        "questionNumber": 155,
        "typeHeader": "TYPE - IV: DIVISIBILITY",
        "examShift": "SSC CGL 20/07/2023 (Shift-02)",
        "questionText": "If the 4-digit number $273x$ is divisible by 12, and the 7-digit number $y854z06$ is divisible by 11, then find the value of $(x + y + z)$.",
        "options": [
            {"label": "A", "text": "14"},
            {"label": "B", "text": "15"},
            {"label": "C", "text": "16"},
            {"label": "D", "text": "18"}
        ],
        "correctOption": "D",
        "solution": "1. For $273x$ divisible by 12 ($3 \\times 4$):\nLast two digits $3x$ divisible by 4 $\\implies x = 2$ or $6$.\nSum of digits $= 2 + 7 + 3 + x = 12 + x$. For this to be divisible by 3, $x$ must be a multiple of 3, so $x = 6$.\n2. For $y854z06$ divisible by 11:\n$(6 + z + 5 + y) - (0 + 4 + 8) = (y + z + 11) - 12 = y + z - 1 = 11 \\implies y + z = 12$.\nNow, $x + y + z = 6 + 12 = 18$."
    },
    {
        "questionNumber": 156,
        "typeHeader": "TYPE - IV: DIVISIBILITY",
        "examShift": "SSC CGL 26/07/2023 (Shift-02)",
        "questionText": "If the 10-digit number $75462A97B6$ is divisible by 72, then what is the value of $\\sqrt{8A - 4B}$?",
        "options": [
            {"label": "A", "text": "$\\sqrt{28}$"},
            {"label": "B", "text": "5"},
            {"label": "C", "text": "6"},
            {"label": "D", "text": "7"}
        ],
        "correctOption": "A",
        "solution": "$72 = 8 \\times 9$.\n1. Last 3 digits $7B6$ divisible by 8: $736 \\div 8 = 92 \\implies B = 3$ (or $776 \\div 8 = 97 \\implies B = 7$).\nFrom book solution, taking $B = 3$:\n2. Sum of digits divisible by 9:\n$7 + 5 + 4 + 6 + 2 + A + 9 + 7 + 3 + 6 = 49 + A$.\nFor $(49 + A)$ to be divisible by 9, $A = 5$.\nThen $\\sqrt{8A - 4B} = \\sqrt{8(5) - 4(3)} = \\sqrt{40 - 12} = \\sqrt{28}$."
    },
    {
        "questionNumber": 157,
        "typeHeader": "TYPE - IV: DIVISIBILITY",
        "examShift": "SSC CGL 21/07/2023 (Shift-03)",
        "questionText": "If the 9-digit number $789x6378y$ is divisible by 72, then find the value of $x \\times y$.",
        "options": [
            {"label": "A", "text": "8"},
            {"label": "B", "text": "12"},
            {"label": "C", "text": "16"},
            {"label": "D", "text": "20"}
        ],
        "correctOption": "A",
        "solution": "$72 = 8 \\times 9$.\n1. Last 3 digits $78y$ divisible by 8: $784 \\div 8 = 98 \\implies y = 4$.\n2. Divisible by 9: Sum of digits $= 7 + 8 + 9 + x + 6 + 3 + 7 + 8 + 4 = 52 + x$.\nFor $(52 + x)$ to be divisible by 9, $52 + x = 54 \\implies x = 2$.\nTherefore, $x \\times y = 2 \\times 4 = 8$."
    },
    {
        "questionNumber": 158,
        "typeHeader": "TYPE - IV: DIVISIBILITY",
        "examShift": "SSC CPO 05/10/2023 (Shift-03)",
        "questionText": "If the 5-digit number $676xy$ is divisible by 3, 7 and 11, then what is the value of $(3x - 5y)$?",
        "options": [
            {"label": "A", "text": "6"},
            {"label": "B", "text": "7"},
            {"label": "C", "text": "9"},
            {"label": "D", "text": "12"}
        ],
        "correctOption": "C",
        "solution": "The number must be divisible by $3 \\times 7 \\times 11 = 231$.\nTake the largest 5-digit number of the form $67699$:\n$67699 \\div 231 = 293 \\text{ remainder } 16$.\nRequired number $= 67699 - 16 = 67683$.\nComparing with $676xy \\implies x = 8, y = 3$.\nNow, $3x - 5y = 3(8) - 5(3) = 24 - 15 = 9$."
    },
    {
        "questionNumber": 159,
        "typeHeader": "TYPE - IV: DIVISIBILITY",
        "examShift": "SSC CGL 19/07/2023 (Shift-02)",
        "questionText": "If the 6-digit number $5x423y$ is divisible by 88, then what is the value of $(5x - 8y)$?",
        "options": [
            {"label": "A", "text": "16"},
            {"label": "B", "text": "18"},
            {"label": "C", "text": "20"},
            {"label": "D", "text": "24"}
        ],
        "correctOption": "D",
        "solution": "$88 = 8 \\times 11$.\n1. Last 3 digits $23y$ divisible by 8: $232 \\div 8 = 29 \\implies y = 2$.\n2. Divisibility by 11:\nSum of odd places $= y + 2 + x = 2 + 2 + x = 4 + x$.\nSum of even places $= 3 + 4 + 5 = 12$.\nDifference $= 12 - (4 + x) = 8 - x = 0 \\implies x = 8$.\nNow, $5x - 8y = 5(8) - 8(2) = 40 - 16 = 24$."
    },
    {
        "questionNumber": 160,
        "typeHeader": "TYPE - IV: DIVISIBILITY",
        "examShift": "SSC CGL 25/07/2023 (Shift-03)",
        "questionText": "If the 9-digit number $7p5964q28$ is divisible by 88, then find the value of $(p^2 - q)$ for the largest value of $q$.",
        "options": [
            {"label": "A", "text": "72"},
            {"label": "B", "text": "64"},
            {"label": "C", "text": "80"},
            {"label": "D", "text": "56"}
        ],
        "correctOption": "A",
        "solution": "$88 = 8 \\times 11$.\n1. Last 3 digits $q28$ divisible by 8: largest single-digit $q = 9$ ($928 \\div 8 = 116$).\n2. Divisibility by 11:\nSum of alternate digits: $(8 + q + 6 + 5 + 7) - (2 + 4 + 9 + p) = (8 + 9 + 6 + 5 + 7) - (15 + p) = 35 - (15 + p) = 20 - p = 11 \\implies p = 9$.\nNow, $p^2 - q = 9^2 - 9 = 81 - 9 = 72$."
    },
    {
        "questionNumber": 161,
        "typeHeader": "TYPE - IV: DIVISIBILITY",
        "examShift": "SSC CHSL 17/03/2023 (Shift-02)",
        "questionText": "If the 8-digit number $94x29y6$ is divisible by 72, where $x \\neq y$, then find the value of $(2x + 3y)$.",
        "options": [
            {"label": "A", "text": "31"},
            {"label": "B", "text": "35"},
            {"label": "C", "text": "37"},
            {"label": "D", "text": "41"}
        ],
        "correctOption": "C",
        "solution": "$72 = 8 \\times 9$.\n1. Last 3 digits $9y6$ divisible by 8: possible values of $y$ are $3$ and $7$.\nTaking $y = 7$:\n2. Divisibility by 9: Sum of digits $= 9 + 4 + x + 2 + 9 + 7 + 6 = 37 + x$.\nFor $(37 + x)$ to be divisible by 9, $x = 8$ (here $x \\neq y$ since $8 \\neq 7$).\nNow, $2x + 3y = 2(8) + 3(7) = 16 + 21 = 37$."
    },
    {
        "questionNumber": 162,
        "typeHeader": "TYPE - IV: DIVISIBILITY",
        "examShift": "SSC CGL 17/08/2021 (Shift-03)",
        "questionText": "Find the sum of squares of the greatest value and the smallest value of K in the number so that the number $45082K$ is divisible by 3.",
        "options": [
            {"label": "A", "text": "68"},
            {"label": "B", "text": "64"},
            {"label": "C", "text": "100"},
            {"label": "D", "text": "50"}
        ],
        "correctOption": "A",
        "solution": "Sum of digits $= 4 + 5 + 0 + 8 + 2 + K = 19 + K$.\nFor $(19 + K)$ to be divisible by 3:\nPossible values of $K$ are $2, 5, 8$.\nSmallest value of $K = 2$, Greatest value of $K = 8$.\nSum of squares $= 8^2 + 2^2 = 64 + 4 = 68$."
    },
    {
        "questionNumber": 163,
        "typeHeader": "TYPE - IV: DIVISIBILITY",
        "examShift": "SSC CGL 18/08/2021 (Shift-01)",
        "questionText": "If the 8 digit number $888x53y4$ is divisible by 72, then what is the value of $(7x + 2y)$, for the maximum value of $y$?",
        "options": [
            {"label": "A", "text": "19"},
            {"label": "B", "text": "15"},
            {"label": "C", "text": "23"},
            {"label": "D", "text": "27"}
        ],
        "correctOption": "C",
        "solution": "$72 = 8 \\times 9$.\n1. Last 3 digits $3y4$ divisible by 8: possible values of $y$ are $0, 4, 8$. For maximum $y$, $y = 8$.\n2. Divisible by 9: Sum of digits $= 8 + 8 + 8 + x + 5 + 3 + 8 + 4 = 44 + x$.\nFor $(44 + x)$ to be divisible by 9, $44 + x = 45 \\implies x = 1$.\nNow, $7x + 2y = 7(1) + 2(8) = 7 + 16 = 23$."
    },
    {
        "questionNumber": 164,
        "typeHeader": "TYPE - IV: DIVISIBILITY",
        "examShift": "SSC CGL 18/08/2021 (Shift-03)",
        "questionText": "If a number P is divisible by 2 and another number Q is divisible by 3, then which of the following is true?",
        "options": [
            {"label": "A", "text": "$P \\times Q$ is divisible by 6"},
            {"label": "B", "text": "$P + Q$ is divisible by 6"},
            {"label": "C", "text": "$P + Q$ is divisible by 5"},
            {"label": "D", "text": "$P \\times Q$ is divisible by 5"}
        ],
        "correctOption": "A",
        "solution": "Since $P$ is divisible by 2, $P = 2k_1$.\nSince $Q$ is divisible by 3, $Q = 3k_2$.\nTheir product $P \\times Q = (2k_1)(3k_2) = 6(k_1 k_2)$, which is clearly a multiple of 6.\nTherefore, $P \\times Q$ is always divisible by 6."
    },
    {
        "questionNumber": 165,
        "typeHeader": "TYPE - IV: DIVISIBILITY",
        "examShift": "SSC CGL 20/08/2021 (Shift-03)",
        "questionText": "The number $823p2q$ is exactly divisible by 7, 11 and 13. What is the value of $(p - q)$?",
        "options": [
            {"label": "A", "text": "8"},
            {"label": "B", "text": "3"},
            {"label": "C", "text": "5"},
            {"label": "D", "text": "11"}
        ],
        "correctOption": "C",
        "solution": "Any 6-digit number divisible by 7, 11 and 13 is divisible by $7 \\times 11 \\times 13 = 1001$.\nA number of the form $abcabc$ is always divisible by 1001.\nComparing $823p2q$ with $abcabc$:\n$a = 8, b = 2, c = 3 \\implies p = a = 8, q = c = 3$.\nTherefore, $p - q = 8 - 3 = 5$."
    },
    {
        "questionNumber": 166,
        "typeHeader": "TYPE - IV: DIVISIBILITY",
        "examShift": "SSC CGL 24/08/2021 (Shift-03)",
        "questionText": "If a nine-digit number $7698x138y$ is divisible by 72, then the value of $\\sqrt{4x + y}$ is:",
        "options": [
            {"label": "A", "text": "8"},
            {"label": "B", "text": "6"},
            {"label": "C", "text": "5"},
            {"label": "D", "text": "9"}
        ],
        "correctOption": "B",
        "solution": "$72 = 8 \\times 9$.\n1. Last 3 digits $38y$ divisible by 8: $384 \\div 8 = 48 \\implies y = 4$.\n2. Divisible by 9: Sum of digits $= 7 + 6 + 9 + 8 + x + 1 + 3 + 8 + 4 = 46 + x$.\nFor $(46 + x)$ to be divisible by 9, $46 + x = 54 \\implies x = 8$.\nNow, $\\sqrt{4x + y} = \\sqrt{4(8) + 4} = \\sqrt{32 + 4} = \\sqrt{36} = 6$."
    },
    {
        "questionNumber": 167,
        "typeHeader": "TYPE - IV: DIVISIBILITY",
        "examShift": "SSC CHSL 16/04/2021 (Shift-01)",
        "questionText": "$n = 475AB$ is a positive integer whose tens and units digits are A and B, respectively. If $n$ is divisible by 5, 8 and 9, then what is $(10A + B)$?",
        "options": [
            {"label": "A", "text": "20"},
            {"label": "B", "text": "35"},
            {"label": "C", "text": "15"},
            {"label": "D", "text": "60"}
        ],
        "correctOption": "A",
        "solution": "1. Divisible by 5 and 8 $\\implies$ unit digit $B$ must be 0 (as multiples of 8 are even).\n2. Divisible by 8 $\\implies$ last three digits $5A0$ must be divisible by 8. Possible values of $A$ are $2$ and $6$.\n3. Divisible by 9 $\\implies$ sum of digits $= 4 + 7 + 5 + A + 0 = 16 + A$.\nFor $(16 + A)$ to be divisible by 9, $A = 2$.\nThen $(10A + B) = 10(2) + 0 = 20$."
    },
    {
        "questionNumber": 168,
        "typeHeader": "TYPE - IV: DIVISIBILITY",
        "examShift": "SSC CHSL 05/08/2021 (Shift-01)",
        "questionText": "If the five-digit number $672xy$ is divisible by 3, 7 and 11, then what is the value of $(6x + 5y)$?",
        "options": [
            {"label": "A", "text": "17"},
            {"label": "B", "text": "24"},
            {"label": "C", "text": "23"},
            {"label": "D", "text": "16"}
        ],
        "correctOption": "A",
        "solution": "The number is divisible by $3 \\times 7 \\times 11 = 231$.\nTake $67299 \\div 231 = 291 \\text{ remainder } 78$.\nRequired number $= 67299 - 78 = 67221$.\nComparing with $672xy \\implies x = 2, y = 1$.\nNow, $6x + 5y = 6(2) + 5(1) = 12 + 5 = 17$."
    },
    {
        "questionNumber": 169,
        "typeHeader": "TYPE - IV: DIVISIBILITY",
        "examShift": "SSC CHSL 12/08/2021 (Shift-01)",
        "questionText": "If the five-digit number $457ab$ is divisible by 3, 7 and 11, then what is the value of $a^2 + b^2 - ab$?",
        "options": [
            {"label": "A", "text": "24"},
            {"label": "B", "text": "36"},
            {"label": "C", "text": "33"},
            {"label": "D", "text": "49"}
        ],
        "correctOption": "D",
        "solution": "The number is divisible by $3 \\times 7 \\times 11 = 231$.\nDividing $45799$ by $231$:\n$45799 = 231 \\times 198 + 61$.\nRequired number $= 45799 - 61 = 45738$.\nComparing with $457ab \\implies a = 3, b = 8$.\nNow, $a^2 + b^2 - ab = 3^2 + 8^2 - (3 \\times 8) = 9 + 64 - 24 = 49$."
    },
    {
        "questionNumber": 170,
        "typeHeader": "TYPE - IV: DIVISIBILITY",
        "examShift": "SSC CGL 10/06/2019 (Shift-02)",
        "questionText": "If the six digit number $15x1y2$ is divisible by 44, then $(x + y)$ is equal to:",
        "options": [
            {"label": "A", "text": "8"},
            {"label": "B", "text": "7"},
            {"label": "C", "text": "6"},
            {"label": "D", "text": "9"}
        ],
        "correctOption": "B",
        "solution": "$44 = 4 \\times 11$.\n1. Last two digits $y2$ divisible by 4 $\\implies y \\in \\{1, 3, 5, 7, 9\\}$.\n2. Divisibility by 11: Difference of alternate digit sums:\nOdd places: $2 + 1 + 5 = 8$.\nEven places: $y + x + 1$.\nDifference $= (x + y + 1) - 8 = x + y - 7 = 0 \\implies x + y = 7$."
    },
    {
        "questionNumber": 171,
        "typeHeader": "TYPE - IV: DIVISIBILITY",
        "examShift": "SSC CGL 13/06/2019 (Shift-01)",
        "questionText": "What is the value of $x$ so that the seven digit number $8439x53$ is divisible by 99?",
        "options": [
            {"label": "A", "text": "9"},
            {"label": "B", "text": "4"},
            {"label": "C", "text": "3"},
            {"label": "D", "text": "6"}
        ],
        "correctOption": "B",
        "solution": "$99 = 9 \\times 11$.\nDivisibility by 9: Sum of digits must be divisible by 9.\nSum $= 8 + 4 + 3 + 9 + x + 5 + 3 = 32 + x$.\nFor $(32 + x)$ to be a multiple of 9, $32 + x = 36 \\implies x = 4$.\nChecking divisibility by 11 for $x = 4$:\n$(3 + 4 + 3 + 8) - (5 + 9 + 4) = 18 - 18 = 0$ (divisible by 11).\nHence, $x = 4$."
    },
    {
        "questionNumber": 172,
        "typeHeader": "TYPE - IV: DIVISIBILITY",
        "examShift": "SSC CHSL 25/05/2022 (Shift-01)",
        "questionText": "What will be the smallest natural number to be filled in the blank for the number $23\\_45678$ to be divisible by 22?",
        "options": [
            {"label": "A", "text": "7"},
            {"label": "B", "text": "1"},
            {"label": "C", "text": "9"},
            {"label": "D", "text": "3"}
        ],
        "correctOption": "A",
        "solution": "$22 = 2 \\times 11$.\nThe number ends in 8, so it is divisible by 2.\nLet the blank digit be $x$. The number is $23x45678$.\nSum of odd place digits $= 8 + 6 + 4 + 3 = 21$.\nSum of even place digits $= 7 + 5 + x + 2 = 14 + x$.\nDifference $= 21 - (14 + x) = 7 - x$.\nFor $(7 - x) = 0$, $x = 7$.\nTherefore, the smallest natural number is $7$."
    },
    {
        "questionNumber": 173,
        "typeHeader": "TYPE - IV: DIVISIBILITY",
        "examShift": "SSC CGL 25/09/2024 (Shift-03)",
        "questionText": "Which of the following numbers is divisible by 6?",
        "options": [
            {"label": "A", "text": "128530"},
            {"label": "B", "text": "12581"},
            {"label": "C", "text": "438750"},
            {"label": "D", "text": "62233"}
        ],
        "correctOption": "C",
        "solution": "A number is divisible by 6 if it is divisible by both 2 and 3.\nCheck Option C (438750):\n1. It ends in 0, so it is divisible by 2.\n2. Sum of digits $= 4 + 3 + 8 + 7 + 5 + 0 = 27$, which is divisible by 3.\nHence, 438750 is divisible by 6."
    },
    {
        "questionNumber": 174,
        "typeHeader": "TYPE - IV: DIVISIBILITY",
        "examShift": "SSC CHSL 04/07/2024 (Shift-01)",
        "questionText": "The number nearest to 7658 and exactly divisible by 45 is:",
        "options": [
            {"label": "A", "text": "7660"},
            {"label": "B", "text": "7645"},
            {"label": "C", "text": "7640"},
            {"label": "D", "text": "7650"}
        ],
        "correctOption": "D",
        "solution": "Dividing 7658 by 45:\n$7658 = 45 \\times 170 + 8$.\nRemainder is 8.\nNearest multiple of 45 is $7658 - 8 = 7650$ (distance $= 8$).\nThe next multiple is $7650 + 45 = 7695$ (distance $= 37$).\nClearly, 7650 is the nearest number."
    },
    {
        "questionNumber": 175,
        "typeHeader": "TYPE - IV: DIVISIBILITY",
        "examShift": "SSC Phase-XII 25/06/2024 (Shift-03)",
        "questionText": "The number 7918378 is divisible by:",
        "options": [
            {"label": "A", "text": "9"},
            {"label": "B", "text": "4"},
            {"label": "C", "text": "13"},
            {"label": "D", "text": "11"}
        ],
        "correctOption": "C",
        "solution": "Dividing 7918378 by 13:\n$7918378 \\div 13 = 609106$ (exact division with remainder 0).\nSum of digits $= 43$ (not div by 9); last two digits 78 (not div by 4); difference of alternate sums is not div by 11.\nTherefore, 7918378 is divisible by 13."
    },
    {
        "questionNumber": 176,
        "typeHeader": "TYPE - IV: DIVISIBILITY",
        "examShift": "SSC Phase-XII 21/06/2024 (Shift-02)",
        "questionText": "The number 1254216 is divisible by which of the following numbers?",
        "options": [
            {"label": "A", "text": "16"},
            {"label": "B", "text": "8"},
            {"label": "C", "text": "11"},
            {"label": "D", "text": "5"}
        ],
        "correctOption": "B",
        "solution": "Checking divisibility by 8:\nA number is divisible by 8 if its last three digits are divisible by 8.\nLast three digits $= 216$.\n$216 \\div 8 = 27$ (exact division).\nHence, 1254216 is divisible by 8."
    },
    {
        "questionNumber": 177,
        "typeHeader": "TYPE - IV: DIVISIBILITY",
        "examShift": "SSC Phase-XII 21/06/2024 (Shift-02)",
        "questionText": "The number 10000 is exactly divisible by which of the following numbers?",
        "options": [
            {"label": "A", "text": "18"},
            {"label": "B", "text": "17"},
            {"label": "C", "text": "14"},
            {"label": "D", "text": "25"}
        ],
        "correctOption": "D",
        "solution": "Checking divisibility of 10000:\n$10000 = 100 \\times 100 = 400 \\times 25$.\nSince $10000 \\div 25 = 400$ exactly, 10000 is divisible by 25."
    },
    {
        "questionNumber": 178,
        "typeHeader": "TYPE - IV: DIVISIBILITY",
        "examShift": "SSC Phase-XII 25/06/2024 (Shift-02)",
        "questionText": "The number 2918245 is divisible by which of the following numbers?",
        "options": [
            {"label": "A", "text": "12"},
            {"label": "B", "text": "9"},
            {"label": "C", "text": "3"},
            {"label": "D", "text": "11"}
        ],
        "correctOption": "D",
        "solution": "Checking divisibility by 11 for 2918245:\nSum of digits at odd places $= 5 + 2 + 1 + 2 = 10$.\nSum of digits at even places $= 4 + 8 + 9 = 21$.\nDifference $= 21 - 10 = 11$, which is a multiple of 11.\nHence, 2918245 is divisible by 11."
    },
    {
        "questionNumber": 179,
        "typeHeader": "TYPE - IV: DIVISIBILITY",
        "examShift": "SSC CHSL 02/08/2023 (Shift-02)",
        "questionText": "Which of the following is NOT divisible by 6?\n(i) 1,97,232  (ii) 9,72,132  (iii) 8,00,552  (iv) 17,90,184",
        "options": [
            {"label": "A", "text": "(i)"},
            {"label": "B", "text": "(iii)"},
            {"label": "C", "text": "(iv)"},
            {"label": "D", "text": "(ii)"}
        ],
        "correctOption": "B",
        "solution": "A number is divisible by 6 if it is divisible by both 2 and 3.\nCheck sum of digits for (iii) 8,00,552:\nSum $= 8 + 0 + 0 + 5 + 5 + 2 = 20$.\nSince 20 is not divisible by 3, 800552 is NOT divisible by 6.\nHence, (iii) is the correct answer."
    },
    {
        "questionNumber": 180,
        "typeHeader": "TYPE - IV: DIVISIBILITY",
        "examShift": "SSC CHSL 02/08/2023 (Shift-03)",
        "questionText": "Which of the following is the nearest number to 13051 and is divisible by 9?",
        "options": [
            {"label": "A", "text": "13057"},
            {"label": "B", "text": "13056"},
            {"label": "C", "text": "13059"},
            {"label": "D", "text": "13058"}
        ],
        "correctOption": "C",
        "solution": "Dividing 13051 by 9:\nSum of digits of $13051 = 1 + 3 + 0 + 5 + 1 = 10$.\nRemainder when 10 is divided by 9 is 1.\nSo $13051 = 9 \\times 1450 + 1$.\nMultiples of 9 around 13051:\n$13051 - 1 = 13050$ (distance $= 1$)\n$13050 + 9 = 13059$ (distance $= 8$).\nFrom the given options (13057, 13056, 13059, 13058), the only number divisible by 9 is 13059 ($1 + 3 + 0 + 5 + 9 = 18$).\nHence, 13059 is the correct option."
    }
]

with open('scripts/number_system_extracted/ch18_part2_151_180.json', 'w', encoding='utf-8') as f:
    json.dump(questions, f, ensure_ascii=False, indent=2)

print(f"Generated Q151-180: {len(questions)} questions")
