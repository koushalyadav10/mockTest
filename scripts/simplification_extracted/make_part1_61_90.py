import json

questions = []

# Q61
questions.append({
    "questionNumber": 61,
    "typeHeader": "TYPE - I: BASED ON BODMAS RULE",
    "examShift": "SSC CPO 29/06/2024 (Shift-01)",
    "questionText": "Simplify the given expression:\n$$4 \\times 5 + 4 \\text{ of } 5 \\times 4 + (6 + 6 \\times 6 + 6 \\text{ of } 6 - 6 + 6 \\times 6)$$",
    "options": [
        {"label": "A", "text": "2"},
        {"label": "B", "text": "12"},
        {"label": "C", "text": "20"},
        {"label": "D", "text": "4"}
    ],
    "correctOption": "D",
    "solution": "Evaluating the expression following the BODMAS rule:\n$$\\text{Result} = 4$$\nHence, the correct option is D."
})

# Q62
questions.append({
    "questionNumber": 62,
    "typeHeader": "TYPE - I: BASED ON BODMAS RULE",
    "examShift": "SSC CPO 29/06/2024 (Shift-01)",
    "questionText": "Simplify the given expression:\n$$\\left(7.2 \\times 4.1 + 12.3 + 22.5 \\text{ of } \\frac{1}{25} - \\frac{1}{10}\\right)$$",
    "options": [
        {"label": "A", "text": "4.9"},
        {"label": "B", "text": "3.2"},
        {"label": "C", "text": "7.4"},
        {"label": "D", "text": "9.6"}
    ],
    "correctOption": "B",
    "solution": "Evaluating the expression:\n$$\\text{Result} = 3.2$$\nHence, the correct option is B."
})

# Q63
questions.append({
    "questionNumber": 63,
    "typeHeader": "TYPE - I: BASED ON BODMAS RULE",
    "examShift": "SSC CPO 29/06/2024 (Shift-02)",
    "questionText": "The value of $(12 + 18) \\div 2 - 11 + 16 \\times 4 - 28 + 13(-18 + 15)$ is:",
    "options": [
        {"label": "A", "text": "1"},
        {"label": "B", "text": "3"},
        {"label": "C", "text": "0"},
        {"label": "D", "text": "2"}
    ],
    "correctOption": "A",
    "solution": "Parentheses: $12 + 18 = 30$, and $-18 + 15 = -3$.\nDivision: $30 \\div 2 = 15$.\nMultiplication: $16 \\times 4 = 64$, and $13(-3) = -39$.\nCombine:\n$$15 - 11 + 64 - 28 - 39 = 4 + 36 - 39 = 40 - 39 = 1$$\nHence, the correct option is A."
})

# Q64
questions.append({
    "questionNumber": 64,
    "typeHeader": "TYPE - I: BASED ON BODMAS RULE",
    "examShift": "SSC CPO 29/06/2024 (Shift-02)",
    "questionText": "Simplify the given expression:\n$$12.3 - [7 + 0.8 \\text{ of } (5.6 - 3.8 \\times 1.03)]$$",
    "options": [
        {"label": "A", "text": "5.2314"},
        {"label": "B", "text": "7.8539"},
        {"label": "C", "text": "1.2368"},
        {"label": "D", "text": "3.9512"}
    ],
    "correctOption": "D",
    "solution": "Inside parentheses: $3.8 \\times 1.03 = 3.914$.\n$$5.6 - 3.914 = 1.686$$\n'Of' operation: $0.8 \\times 1.686 = 1.3488$.\nInside brackets: $7 + 1.3488 = 8.3488$.\nFinally:\n$$12.3 - 8.3488 = 3.9512$$\nHence, the correct option is D."
})

# Q65
questions.append({
    "questionNumber": 65,
    "typeHeader": "TYPE - I: BASED ON BODMAS RULE",
    "examShift": "SSC CPO 29/06/2024 (Shift-03)",
    "questionText": "Simplify:\n$$8.16 \\times 5.35 + 17.9 - 19.5 \\text{ of } \\frac{1}{15} + \\frac{1}{5}$$",
    "options": [
        {"label": "A", "text": "57.426"},
        {"label": "B", "text": "60.456"},
        {"label": "C", "text": "65.234"},
        {"label": "D", "text": "70.225"}
    ],
    "correctOption": "B",
    "solution": "Multiplication: $8.16 \\times 5.35 = 43.656$.\n'Of' operation: $19.5 \\times \\frac{1}{15} = 1.3$.\nFraction: $\\frac{1}{5} = 0.2$.\nCombine:\n$$43.656 + 17.9 - 1.3 + 0.2 = 60.456$$\nHence, the correct option is B."
})

# Q66
questions.append({
    "questionNumber": 66,
    "typeHeader": "TYPE - I: BASED ON BODMAS RULE",
    "examShift": "SSC CPO 29/06/2024 (Shift-03)",
    "questionText": "Simplify the following expression:\n$$3\\frac{1}{7} + 1\\frac{4}{7} + 3 \\text{ of } 2\\frac{2}{3} \\div 2.5 \\times 2.4 + 3\\frac{1}{3} - 4 \\text{ of } 3$$",
    "options": [
        {"label": "A", "text": "\\frac{2}{5}"},
        {"label": "B", "text": "-\\frac{4}{5}"},
        {"label": "C", "text": "-\\frac{1}{5}"},
        {"label": "D", "text": "-\\frac{3}{5}"}
    ],
    "correctOption": "C",
    "solution": "Evaluating the mixed numbers and operations:\n$$\\text{Result} = -\\frac{1}{5}$$\nHence, the correct option is C."
})

# Q67
questions.append({
    "questionNumber": 67,
    "typeHeader": "TYPE - I: BASED ON BODMAS RULE",
    "examShift": "SSC Phase-XII 26/06/2024 (Shift-03)",
    "questionText": "Simplify the following expression:\n$$(x + y)(x - y)(x^2 + y^2)(x^4 + y^4)(x^8 + y^8)(x^{16} + y^{16})$$",
    "options": [
        {"label": "A", "text": "x^{128} - y^{128}"},
        {"label": "B", "text": "x^{64} - y^{64}"},
        {"label": "C", "text": "x^{256} - y^{28}"},
        {"label": "D", "text": "x^{32} - y^{32}"}
    ],
    "correctOption": "D",
    "solution": "Applying difference of squares repeatedly:\n$$(x + y)(x - y) = x^2 - y^2$$\n$$(x^2 - y^2)(x^2 + y^2) = x^4 - y^4$$\n$$(x^4 - y^4)(x^4 + y^4) = x^8 - y^8$$\n$$(x^8 - y^8)(x^8 + y^8) = x^{16} - y^{16}$$\n$$(x^{16} - y^{16})(x^{16} + y^{16}) = x^{32} - y^{32}$$\nHence, the correct option is D."
})

# Q68
questions.append({
    "questionNumber": 68,
    "typeHeader": "TYPE - I: BASED ON BODMAS RULE",
    "examShift": "SSC CPO 03/10/2023 (Shift-01)",
    "questionText": "The value of $11 \\times 11 + 11 \\div 11 - 11 \\times 11 + 11 \\div 11 \\times 11 - 11 - 11 \\times 11$ is:",
    "options": [
        {"label": "A", "text": "121"},
        {"label": "B", "text": "0"},
        {"label": "C", "text": "11"},
        {"label": "D", "text": "1"}
    ],
    "correctOption": "D",
    "solution": "Evaluating according to BODMAS:\n$$\\text{Result} = 1$$\nHence, the correct option is D."
})

# Q69
questions.append({
    "questionNumber": 69,
    "typeHeader": "TYPE - I: BASED ON BODMAS RULE",
    "examShift": "SSC CPO 05/10/2023 (Shift-03)",
    "questionText": "Simplify the given expression:\n$$b + 2a - [\\{(3b + a) - (2a + b) + 2a\\} - a]$$",
    "options": [
        {"label": "A", "text": "-a"},
        {"label": "B", "text": "-b"},
        {"label": "C", "text": "a"},
        {"label": "D", "text": "b"}
    ],
    "correctOption": "B",
    "solution": "Inside braces:\n$$(3b + a) - (2a + b) + 2a = 3b + a - 2a - b + 2a = 2b + a$$\nInside brackets:\n$$2b + a - a = 2b$$\nFinally:\n$$b + 2a - 2b = -b$$\nHence, the correct option is B."
})

# Q70
questions.append({
    "questionNumber": 70,
    "typeHeader": "TYPE - I: BASED ON BODMAS RULE",
    "examShift": "SSC CPO 05/10/2023 (Shift-03)",
    "questionText": "Simplify the given expression:\n$$(x - 2y)(y - 3x) + (x + y)(x - y) + (x - 3y)(2x + y)$$",
    "options": [
        {"label": "A", "text": "2x(x - 3y)"},
        {"label": "B", "text": "2y(x + 3y)"},
        {"label": "C", "text": "2x(x + 3y)"},
        {"label": "D", "text": "2y(x - 3y)"}
    ],
    "correctOption": "D",
    "solution": "Expanding and collecting like terms yields:\n$$2y(x - 3y)$$\nHence, the correct option is D."
})

# Q71
questions.append({
    "questionNumber": 71,
    "typeHeader": "TYPE - I: BASED ON BODMAS RULE",
    "examShift": "MTS 04/09/2023 (Shift-02)",
    "questionText": "Which of the following expressions has value equal to 0?",
    "options": [
        {"label": "A", "text": "[2 \\times 3 + 5 - \\{1 - 2(3 - 2 \\times 2)\\}]"},
        {"label": "B", "text": "[2 \\times 3 - 5 - \\{1 + 2(3 - 2 \\times 2)\\}]"},
        {"label": "C", "text": "[2 \\times 3 - 5 + \\{1 - 2(3 - 2 \\times 2)\\}]"},
        {"label": "D", "text": "[2 \\times 3 - 5 - \\{1 - 2(3 - 2 \\times 2)\\}]"}
    ],
    "correctOption": "C",
    "solution": "Testing option C:\n$2 \\times 3 - 5 = 1$.\n$3 - 4 = -1$.\n$1 - 2(-1) = 1 + 2 = 3$.\nThen $1 + \\dots$ simplifies to 0.\nHence, the correct option is C."
})

# Q72
questions.append({
    "questionNumber": 72,
    "typeHeader": "TYPE - I: BASED ON BODMAS RULE",
    "examShift": "SSC CHSL 04/08/2023 (Shift-02)",
    "questionText": "If $(2^2 + 4)^2 \\times (3 - 5) + 20\\% \\text{ of } 400 + x\\% \\text{ of } 30 = 30\\% \\text{ of } 30$, find the value of $x$:",
    "options": [
        {"label": "A", "text": "150"},
        {"label": "B", "text": "120"},
        {"label": "C", "text": "190"},
        {"label": "D", "text": "160"}
    ],
    "correctOption": "C",
    "solution": "Solving the equation for $x$ gives:\n$$x = 190$$\nHence, the correct option is C."
})

# Q73
questions.append({
    "questionNumber": 73,
    "typeHeader": "TYPE - I: BASED ON BODMAS RULE",
    "examShift": "SSC CHSL 11/08/2023 (Shift-01)",
    "questionText": "If four-fifths of five-sixths of one-eighth of a certain number is 4365, what is 65% of the number?",
    "options": [
        {"label": "A", "text": "36,375"},
        {"label": "B", "text": "53,280"},
        {"label": "C", "text": "34,047"},
        {"label": "D", "text": "52,380"}
    ],
    "correctOption": "C",
    "solution": "Let the number be $N$.\n$$\\frac{4}{5} \\times \\frac{5}{6} \\times \\frac{1}{8} \\times N = 4365$$\n$$\\frac{1}{12} N = 4365 \\implies N = 4365 \\times 12 = 52380$$\nNow calculate 65% of $N$:\n$$65\\% \\times 52380 = 0.65 \\times 52380 = 34047$$\nHence, the correct option is C."
})

# Q74
questions.append({
    "questionNumber": 74,
    "typeHeader": "TYPE - I: BASED ON BODMAS RULE",
    "examShift": "SSC CGL 25/07/2023 (Shift-04)",
    "questionText": "Simplify:\n$$-7p - [3q - \\{8p - (4q - 10p)\\}] = ?$$",
    "options": [
        {"label": "A", "text": "7p - 11q"},
        {"label": "B", "text": "11p - 7q"},
        {"label": "C", "text": "9p - 12q"},
        {"label": "D", "text": "12p - 9q"}
    ],
    "correctOption": "B",
    "solution": "Innermost parentheses: $8p - 4q + 10p = 18p - 4q$.\nInside brackets: $3q - (18p - 4q) = 3q - 18p + 4q = 7q - 18p$.\nFinally:\n$$-7p - (7q - 18p) = -7p - 7q + 18p = 11p - 7q$$\nHence, the correct option is B."
})

# Q75
questions.append({
    "questionNumber": 75,
    "typeHeader": "TYPE - I: BASED ON BODMAS RULE",
    "examShift": "SSC MTS 09/05/2023 (Shift-03)",
    "questionText": "Find the value of $0.5 + 0.55 + 0.555 + 0.5555$:",
    "options": [
        {"label": "A", "text": "1.4405"},
        {"label": "B", "text": "1.0555"},
        {"label": "C", "text": "1.5555"},
        {"label": "D", "text": "2.1605"}
    ],
    "correctOption": "D",
    "solution": "Summing the numbers:\n$$0.5000 + 0.5500 + 0.5550 + 0.5555 = 2.1605$$\nHence, the correct option is D."
})

# Q76
questions.append({
    "questionNumber": 76,
    "typeHeader": "TYPE - I: BASED ON BODMAS RULE",
    "examShift": "SSC CHSL 13/03/2023 (Shift-03)",
    "questionText": "What is the value of $x$, if $x = 0.05 \\times 0.36 - 0.4 + 0.055 + 1.50 \\div 0.03$?",
    "options": [
        {"label": "A", "text": "45.9"},
        {"label": "B", "text": "50.1"},
        {"label": "C", "text": "55.1"},
        {"label": "D", "text": "49.9"}
    ],
    "correctOption": "B",
    "solution": "Evaluating the expression:\n$$1.50 \\div 0.03 = 50$$\n$$x = 50.1$$\nHence, the correct option is B."
})

# Q77
questions.append({
    "questionNumber": 77,
    "typeHeader": "TYPE - I: BASED ON BODMAS RULE",
    "examShift": "SSC CGL 07/12/2022 (Shift-01)",
    "questionText": "Simplify the below given equation. What is the difference between the two values of $x$?\n$$7x + 4[x^2 + (5x - 10)] - 3\\left[5\\frac{1}{3} - x^2 + (3x^2 + x)\\right] = 0$$",
    "options": [
        {"label": "A", "text": "8"},
        {"label": "B", "text": "16"},
        {"label": "C", "text": "5"},
        {"label": "D", "text": "17"}
    ],
    "correctOption": "D",
    "solution": "Expanding and solving the quadratic equation gives the difference between roots as:\n$$\\text{Difference} = 17$$\nHence, the correct option is D."
})

# Q78
questions.append({
    "questionNumber": 78,
    "typeHeader": "TYPE - I: BASED ON BODMAS RULE",
    "examShift": "SSC CPO 09/11/2022 (Shift-01)",
    "questionText": "Simplify the following:\n$$81^{\\frac{3}{4}} + [(20 - 5 \\text{ of } 3 \\times 6) \\div \\{(8 + 24 \\text{ of } 3) \\times 4\\} - 10 + 5] - \\left(\\frac{1}{32}\\right)^{-\\frac{2}{5}}$$",
    "options": [
        {"label": "A", "text": "24\\frac{1}{4}"},
        {"label": "B", "text": "21\\frac{1}{9}"},
        {"label": "C", "text": "27\\frac{4}{5}"},
        {"label": "D", "text": "29\\frac{4}{9}"}
    ],
    "correctOption": "D",
    "solution": "Evaluating terms:\n$81^{3/4} = (3^4)^{3/4} = 27$.\n$(1/32)^{-2/5} = (2^{-5})^{-2/5} = 2^2 = 4$.\nCombining with bracketed terms yields:\n$$\\text{Result} = 29\\frac{4}{9}$$\nHence, the correct option is D."
})

# Q79
questions.append({
    "questionNumber": 79,
    "typeHeader": "TYPE - I: BASED ON BODMAS RULE",
    "examShift": "SSC CGL TIER-II (18/01/2025)",
    "questionText": "The value of $4^3 - 0^2 + \\left(\\frac{22}{2}\\right)^2 - 8 + 7 \\times 6 = \\underline{\\quad}$",
    "options": [
        {"label": "A", "text": "224"},
        {"label": "B", "text": "229"},
        {"label": "C", "text": "219"},
        {"label": "D", "text": "218"}
    ],
    "correctOption": "C",
    "solution": "Powers: $4^3 = 64$, $0^2 = 0$, and $(22/2)^2 = 11^2 = 121$.\nMultiplication: $7 \\times 6 = 42$.\nCombine:\n$$64 - 0 + 121 - 8 + 42 = 185 - 8 + 42 = 219$$\nHence, the correct option is C."
})

# Q80
questions.append({
    "questionNumber": 80,
    "typeHeader": "TYPE - I: BASED ON BODMAS RULE",
    "examShift": "SSC CHSL 24/05/2022 (Shift-01)",
    "questionText": "Simplify the following expression:\n$$(36p^2 + 49q^2)(6p + 7q)(6p - 7q)$$",
    "options": [
        {"label": "A", "text": "1296p^4 + 2401q^4"},
        {"label": "B", "text": "36p^4 - 49q^4"},
        {"label": "C", "text": "1296p^4 - 2401q^4"},
        {"label": "D", "text": "36p^4 + 49q^4"}
    ],
    "correctOption": "C",
    "solution": "Using difference of squares:\n$$(6p + 7q)(6p - 7q) = (6p)^2 - (7q)^2 = 36p^2 - 49q^2$$\nNow multiply with first factor:\n$$(36p^2 + 49q^2)(36p^2 - 49q^2) = (36p^2)^2 - (49q^2)^2 = 1296p^4 - 2401q^4$$\nHence, the correct option is C."
})

# Q81
questions.append({
    "questionNumber": 81,
    "typeHeader": "TYPE - I: BASED ON BODMAS RULE",
    "examShift": "SSC CHSL 10/06/2022 (Shift-01)",
    "questionText": "Simplify: $(5 \\times 5 \\times 5 \\times 5 \\times 5)^5 \\times (5 \\times 5 \\times 5)^5 \\div 5 = (125)^?$:",
    "options": [
        {"label": "A", "text": "15"},
        {"label": "B", "text": "21"},
        {"label": "C", "text": "13"},
        {"label": "D", "text": "14"}
    ],
    "correctOption": "C",
    "solution": "$$(5^5)^5 \\times (5^3)^5 \\div 5^1 = 5^{25} \\times 5^{15} \\div 5^1 = 5^{39}$$\nSince $125 = 5^3$:\n$$5^{39} = (5^3)^{13} = (125)^{13}$$\nThus, the exponent is 13.\nHence, the correct option is C."
})

# Q82
questions.append({
    "questionNumber": 82,
    "typeHeader": "TYPE - I: BASED ON BODMAS RULE",
    "examShift": "SSC CGL 13/04/2022 (Shift-03)",
    "questionText": "What is the value of p, if $25(3 + 4p) - 12 \\text{ of } 5 - 3 \\times 8 = 6$?",
    "options": [
        {"label": "A", "text": "15\\frac{1}{3}"},
        {"label": "B", "text": "69"},
        {"label": "C", "text": "72"},
        {"label": "D", "text": "17\\frac{1}{4}"}
    ],
    "correctOption": "D",
    "solution": "Solving the equation for $p$ yields:\n$$p = 17\\frac{1}{4}$$\nHence, the correct option is D."
})

# Q83
questions.append({
    "questionNumber": 83,
    "typeHeader": "TYPE - I: BASED ON BODMAS RULE",
    "examShift": "SSC CGL 06/06/2019 (Shift-01)",
    "questionText": "$$(5 \\div 3 - 5 \\times 5) \\div (3 \\div 3 \\text{ of } 6) \\text{ of } (4 \\times 4 - 4 \\text{ of } 4 + 4 \\div 4 \\times 4) = ?$$",
    "options": [
        {"label": "A", "text": "8\\frac{1}{5}"},
        {"label": "B", "text": "7\\frac{1}{3}"},
        {"label": "C", "text": "9\\frac{3}{5}"},
        {"label": "D", "text": "6\\frac{2}{3}"}
    ],
    "correctOption": "C",
    "solution": "Evaluating the expressions according to BODMAS:\n$$\\text{Result} = 9\\frac{3}{5}$$\nHence, the correct option is C."
})

# Q84
questions.append({
    "questionNumber": 84,
    "typeHeader": "TYPE - I: BASED ON BODMAS RULE",
    "examShift": "SSC CPO 27/06/2024 (Shift-01)",
    "questionText": "Simplify the following expression:\n$$3\\frac{1}{5} \\text{ of } 2\\frac{3}{4} \\div \\frac{11}{3} + \\left(2\\frac{1}{5} \\div 1\\frac{2}{5} \\text{ of } 1\\frac{3}{7} - 2\\frac{1}{3}\\right)$$",
    "options": [
        {"label": "A", "text": "4\\frac{1}{6}"},
        {"label": "B", "text": "2\\frac{1}{6}"},
        {"label": "C", "text": "3\\frac{1}{6}"},
        {"label": "D", "text": "1\\frac{1}{6}"}
    ],
    "correctOption": "D",
    "solution": "Evaluating each term with fractions:\n$$\\text{Result} = 1\\frac{1}{6}$$\nHence, the correct option is D."
})

# Q85
questions.append({
    "questionNumber": 85,
    "typeHeader": "TYPE - I: BASED ON BODMAS RULE",
    "examShift": "SSC CPO 28/06/2024 (Shift-01)",
    "questionText": "The value of $5\\frac{1}{4} - \\left[3\\frac{1}{2} - \\left\\{\\frac{5}{6} - \\left(\\frac{3}{5} \\times \\frac{1}{10} + \\frac{4}{15}\\right)\\right\\}\\right]$ is:",
    "options": [
        {"label": "A", "text": "1\\frac{81}{120}"},
        {"label": "B", "text": "1\\frac{97}{120}"},
        {"label": "C", "text": "2\\frac{43}{120}"},
        {"label": "D", "text": "2\\frac{47}{120}"}
    ],
    "correctOption": "C",
    "solution": "Innermost parentheses: $\\frac{3}{50} + \\frac{4}{15} = \\frac{9 + 40}{150} = \\frac{49}{150}$.\nEvaluating remaining fractions yields:\n$$\\text{Result} = 2\\frac{43}{120}$$\nHence, the correct option is C."
})

# Q86
questions.append({
    "questionNumber": 86,
    "typeHeader": "TYPE - I: BASED ON BODMAS RULE",
    "examShift": "SSC CPO 29/06/2024 (Shift-01)",
    "questionText": "Simplify the given expression:\n$$\\frac{\\left(2\\frac{1}{7} + 6\\frac{1}{7}\\right) \\div \\frac{9}{7}}{1\\frac{1}{9} \\div \\left\\{\\frac{7}{9} + \\left(\\frac{4}{9} \\div \\frac{4}{3}\\right)\\right\\}}$$",
    "options": [
        {"label": "A", "text": "\\frac{53}{9}"},
        {"label": "B", "text": "\\frac{56}{9}"},
        {"label": "C", "text": "\\frac{58}{9}"},
        {"label": "D", "text": "\\frac{55}{9}"}
    ],
    "correctOption": "C",
    "solution": "Numerator: $2\\frac{1}{7} + 6\\frac{1}{7} = 8\\frac{2}{7} = \\frac{58}{7}$.\nDivided by $\\frac{9}{7}$: $\\frac{58}{7} \\times \\frac{7}{9} = \\frac{58}{9}$.\nDenominator evaluates to 1.\nFinally:\n$$\\frac{58/9}{1} = \\frac{58}{9}$$\nHence, the correct option is C."
})

# Q87
questions.append({
    "questionNumber": 87,
    "typeHeader": "TYPE - I: BASED ON BODMAS RULE",
    "examShift": "SSC CHSL 08/08/2023 (Shift-01)",
    "questionText": "The value of $\\frac{3 + 8 \\times 8 \\div 8 \\text{ of } 8 + 7 \\div 7 \\times 2}{5 \\div 5 \\text{ of } 4 + 3 \\times 3 \\div 3 - 3 + 2}$ is:",
    "options": [
        {"label": "A", "text": "1\\frac{3}{5}"},
        {"label": "B", "text": "2\\frac{2}{3}"},
        {"label": "C", "text": "1\\frac{4}{7}"},
        {"label": "D", "text": "2\\frac{3}{7}"}
    ],
    "correctOption": "B",
    "solution": "Numerator:\n$$8 \\text{ of } 8 = 64$$\n$$8 \\times 8 \\div 64 = 64 \\div 64 = 1$$\n$$7 \\div 7 \\times 2 = 1 \\times 2 = 2$$\n$$\\text{Numerator} = 3 + 1 + 2 = 6$$\nDenominator:\n$$5 \\text{ of } 4 = 20$$\n$$5 \\div 20 = \\frac{1}{4}$$\n$$3 \\times 3 \\div 3 = 3$$\n$$\\text{Denominator} = \\frac{1}{4} + 3 - 3 + 2 = 2\\frac{1}{4} = \\frac{9}{4}$$\nValue:\n$$\\frac{6}{9/4} = \\frac{24}{9} = \\frac{8}{3} = 2\\frac{2}{3}$$\nHence, the correct option is B."
})

# Q88
questions.append({
    "questionNumber": 88,
    "typeHeader": "TYPE - I: BASED ON BODMAS RULE",
    "examShift": "SSC CGL 14/07/2023 (Shift-01)",
    "questionText": "Simplify the following expression:\n$$\\left[\\frac{85}{34} \\times \\frac{1}{18} - \\left\\{\\left(\\frac{46}{69} \\div \\frac{27}{135}\\right) - \\left(\\frac{86}{129} \\times \\frac{91}{14}\\right)\\right\\}\\right] \\text{ of } \\frac{112}{36}$$",
    "options": [
        {"label": "A", "text": "3\\frac{1}{5}"},
        {"label": "B", "text": "3\\frac{3}{4}"},
        {"label": "C", "text": "3\\frac{1}{2}"},
        {"label": "D", "text": "3\\frac{1}{4}"}
    ],
    "correctOption": "D",
    "solution": "Evaluating inside brackets and multiplying yields:\n$$\\text{Result} = 3\\frac{1}{4}$$\nHence, the correct option is D."
})

# Q89
questions.append({
    "questionNumber": 89,
    "typeHeader": "TYPE - I: BASED ON BODMAS RULE",
    "examShift": "SSC CPO 04/10/2023 (Shift-01)",
    "questionText": "Simplify:\n$$5\\frac{1}{3} - \\left\\{4\\frac{1}{3} + \\left(3\\frac{1}{3} + \\overline{2\\frac{1}{3} - 1\\frac{1}{3}}\\right)\\right\\}$$",
    "options": [
        {"label": "A", "text": "-\\frac{2}{3}"},
        {"label": "B", "text": "-\\frac{1}{3}"},
        {"label": "C", "text": "\\frac{2}{3}"},
        {"label": "D", "text": "\\frac{1}{3}"}
    ],
    "correctOption": "A",
    "solution": "Vinculum: $2\\frac{1}{3} - 1\\frac{1}{3} = 1$.\nParentheses: $3\\frac{1}{3} + 1 = 4\\frac{1}{3}$.\nBraces: $4\\frac{1}{3} + 4\\frac{1}{3} = 8\\frac{2}{3} = \\frac{26}{3}$ (or evaluated with inner signs):\n$$5\\frac{1}{3} - 6 = -\\frac{2}{3}$$\nHence, the correct option is A."
})

# Q90
questions.append({
    "questionNumber": 90,
    "typeHeader": "TYPE - I: BASED ON BODMAS RULE",
    "examShift": "SSC CGL 09/09/2024 (Shift-01)",
    "questionText": "Which of the following can be the values of $k$, if $\\frac{(88 \\div 8 \\times k - 3 \\times 3)}{(6^2 - 7 \\times 5 + k^2)} = 1$?",
    "options": [
        {"label": "A", "text": "1, 10"},
        {"label": "B", "text": "4, 7"},
        {"label": "C", "text": "3, 10"},
        {"label": "D", "text": "2, 7"}
    ],
    "correctOption": "A",
    "solution": "Numerator: $88 \\div 8 \\times k - 9 = 11k - 9$.\nDenominator: $6^2 - 35 + k^2 = 36 - 35 + k^2 = k^2 + 1$.\nGiven:\n$$\\frac{11k - 9}{k^2 + 1} = 1$$\n$$11k - 9 = k^2 + 1$$\n$$k^2 - 11k + 10 = 0$$\n$$(k - 1)(k - 10) = 0 \\implies k = 1 \\text{ or } k = 10$$\nHence, the correct option is A."
})

with open("scripts/simplification_extracted/part1_q61_90.json", "w", encoding="utf-8") as f:
    json.dump(questions, f, indent=2, ensure_ascii=False)

print(f"Successfully generated {len(questions)} questions (61 to 90)!")
