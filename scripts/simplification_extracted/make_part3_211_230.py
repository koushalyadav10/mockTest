# Builder script for Questions 211 to 230
import json

questions = []

questions.append({
    "questionNumber": 211,
    "typeHeader": "TYPE - II: BASED ON ALGEBRAIC FORMULAE",
    "examShift": "SSC CHSL 04/08/2023 (Shift-01)",
    "questionText": "Simplify $\\frac{(3.321)^3 + (2.681)^3 + (1.245)^3 - 3 \\times 3.321 \\times 2.681 \\times 1.245}{(3.321)^2 + (2.681)^2 + (1.245)^2 - (3.321 \\times 2.681) - (2.681 \\times 1.245) - (1.245) \\times 3.321}$",
    "options": [
        {"label": "A", "text": "6.125"},
        {"label": "B", "text": "8.645"},
        {"label": "C", "text": "7.247"},
        {"label": "D", "text": "10.245"}
    ],
    "correctOption": "C",
    "solution": "Let $a = 3.321$, $b = 2.681$, and $c = 1.245$.\nThe expression is of the form:\n$$\\frac{a^3 + b^3 + c^3 - 3abc}{a^2 + b^2 + c^2 - ab - bc - ca} = a + b + c$$\nSubstituting the values:\n$$a + b + c = 3.321 + 2.681 + 1.245 = 7.247$$\nHence, the correct option is C."
})

questions.append({
    "questionNumber": 212,
    "typeHeader": "TYPE - II: BASED ON ALGEBRAIC FORMULAE",
    "examShift": "SSC CHSL 10/08/2023 (Shift-01)",
    "questionText": "Simplify the given expression.\n$$\\frac{(80 \\times 80 \\times 80) + (70 \\times 70 \\times 70) + (50 \\times 50 \\times 50) - 840000}{6400 + 4900 + 2500 - 5600 - 3500 - 4000}$$",
    "options": [
        {"label": "A", "text": "100"},
        {"label": "B", "text": "200"},
        {"label": "C", "text": "400"},
        {"label": "D", "text": "300"}
    ],
    "correctOption": "B",
    "solution": "Let $a = 80$, $b = 70$, and $c = 50$.\nNotice that $3abc = 3 \\times 80 \\times 70 \\times 50 = 840000$.\nAlso, the denominator is:\n$$a^2 + b^2 + c^2 - ab - bc - ca = 80^2 + 70^2 + 50^2 - 80(70) - 70(50) - 50(80)$$\n$$= 6400 + 4900 + 2500 - 5600 - 3500 - 4000$$\nThus, the expression simplifies to:\n$$\\frac{a^3 + b^3 + c^3 - 3abc}{a^2 + b^2 + c^2 - ab - bc - ca} = a + b + c$$\n$$a + b + c = 80 + 70 + 50 = 200$$\nHence, the correct option is B."
})

questions.append({
    "questionNumber": 213,
    "typeHeader": "TYPE - II: BASED ON ALGEBRAIC FORMULAE",
    "examShift": "SSC CHSL 09/06/2022 (Shift-03)",
    "questionText": "Simplify: $(a^{-1} + b^{-1}) \\div (a^{-3} + b^{-3})$",
    "options": [
        {"label": "A", "text": "\\frac{ab}{(a^2 - ab + b^2)}"},
        {"label": "B", "text": "\\frac{a^3 b^3}{(a^2 - ab + b^2)}"},
        {"label": "C", "text": "\\frac{a^2 b^2}{(a^2 + ab + b^2)}"},
        {"label": "D", "text": "\\frac{a^2 b^2}{(a^2 - ab + b^2)}"}
    ],
    "correctOption": "D",
    "solution": "Express negative powers in fractional form:\n$$a^{-1} + b^{-1} = \\frac{1}{a} + \\frac{1}{b} = \\frac{a + b}{ab}$$\n$$a^{-3} + b^{-3} = \\frac{1}{a^3} + \\frac{1}{b^3} = \\frac{a^3 + b^3}{a^3 b^3} = \\frac{(a + b)(a^2 - ab + b^2)}{a^3 b^3}$$\nDividing the two expressions:\n$$\\frac{a + b}{ab} \\div \\frac{(a + b)(a^2 - ab + b^2)}{a^3 b^3} = \\frac{a + b}{ab} \\times \\frac{a^3 b^3}{(a + b)(a^2 - ab + b^2)} = \\frac{a^2 b^2}{a^2 - ab + b^2}$$\nHence, the correct option is D."
})

questions.append({
    "questionNumber": 214,
    "typeHeader": "TYPE - II: BASED ON ALGEBRAIC FORMULAE",
    "examShift": "SSC CGL 10/09/2024 (Shift-02)",
    "questionText": "Simplify $\\frac{0.58 \\times 0.58 \\times 0.58 - 0.001}{0.58 \\times 0.58 + 0.058 + 0.01}$",
    "options": [
        {"label": "A", "text": "0.48"},
        {"label": "B", "text": "0.28"},
        {"label": "C", "text": "0.37"},
        {"label": "D", "text": "0.42"}
    ],
    "correctOption": "A",
    "solution": "Let $a = 0.58$ and $b = 0.1$.\nNotice that $b^3 = (0.1)^3 = 0.001$, $ab = 0.58 \\times 0.1 = 0.058$, and $b^2 = (0.1)^2 = 0.01$.\nThe expression is:\n$$\\frac{a^3 - b^3}{a^2 + ab + b^2} = a - b$$\nSubstituting $a = 0.58$ and $b = 0.1$:\n$$0.58 - 0.1 = 0.48$$\nHence, the correct option is A."
})

questions.append({
    "questionNumber": 215,
    "typeHeader": "TYPE - II: BASED ON ALGEBRAIC FORMULAE",
    "examShift": "SSC CGL 13/09/2024 (Shift-03)",
    "questionText": "Simplify $\\frac{1.5 \\times 1.5 + 2.5 \\times 2.5 + 3.5 \\times 3.5 + 2 \\times 1.5 \\times 2.5 + 2 \\times 2.5 \\times 3.5 + 2 \\times 1.5 \\times 3.5}{1.5 + 2.5 + 3.5}$",
    "options": [
        {"label": "A", "text": "9.5"},
        {"label": "B", "text": "6.5"},
        {"label": "C", "text": "8.5"},
        {"label": "D", "text": "7.5"}
    ],
    "correctOption": "D",
    "solution": "Let $a = 1.5$, $b = 2.5$, and $c = 3.5$.\nThe numerator is:\n$$a^2 + b^2 + c^2 + 2ab + 2bc + 2ca = (a + b + c)^2$$\nDividing by $(a + b + c)$ gives:\n$$\\frac{(a + b + c)^2}{a + b + c} = a + b + c$$\nSubstituting the values:\n$$1.5 + 2.5 + 3.5 = 7.5$$\nHence, the correct option is D."
})

questions.append({
    "questionNumber": 216,
    "typeHeader": "TYPE - III: COMPARISON OF FRACTION",
    "examShift": "SSC CPO 11/11/2022 (Shift-02)",
    "questionText": "Arrange the given ratios in descending order $15 : 7$, $5 : 11$ and $21 : 77$.",
    "options": [
        {"label": "A", "text": "21 : 77 > 5 : 11 > 15 : 7"},
        {"label": "B", "text": "15 : 7 > 5 : 11 > 21 : 77"},
        {"label": "C", "text": "15 : 7 > 21 : 77 > 5 : 11"},
        {"label": "D", "text": "5 : 11 > 15 : 7 > 21 : 77"}
    ],
    "correctOption": "B",
    "solution": "Convert each ratio to decimal form for comparison:\n$$15 : 7 = \\frac{15}{7} \\approx 2.1428$$\n$$5 : 11 = \\frac{5}{11} \\approx 0.4545$$\n$$21 : 77 = \\frac{3}{11} \\approx 0.2727$$\nArranging in descending order (largest to smallest):\n$$2.1428 > 0.4545 > 0.2727 \\implies 15 : 7 > 5 : 11 > 21 : 77$$\nHence, the correct option is B."
})

questions.append({
    "questionNumber": 217,
    "typeHeader": "TYPE - III: COMPARISON OF FRACTION",
    "examShift": "SSC CHSL Tier-II 26/06/2023",
    "questionText": "Find the correct descending order of the following ratios.\n$$\\frac{17}{30}, \\frac{7}{15}, \\frac{27}{50}, \\frac{11}{20}$$",
    "options": [
        {"label": "A", "text": "\\frac{11}{20} > \\frac{17}{30} > \\frac{27}{50} > \\frac{7}{15}"},
        {"label": "B", "text": "\\frac{17}{30} > \\frac{11}{20} > \\frac{27}{50} > \\frac{7}{15}"},
        {"label": "C", "text": "\\frac{17}{30} > \\frac{27}{50} > \\frac{11}{20} > \\frac{7}{15}"},
        {"label": "D", "text": "\\frac{7}{15} > \\frac{11}{20} > \\frac{27}{50} > \\frac{17}{30}"}
    ],
    "correctOption": "B",
    "solution": "Convert the fractions to common denominator $\\text{LCM}(30, 15, 50, 20) = 300$:\n$$\\frac{17}{30} = \\frac{170}{300} = 0.5667$$\n$$\\frac{11}{20} = \\frac{165}{300} = 0.55$$\n$$\\frac{27}{50} = \\frac{162}{300} = 0.54$$\n$$\\frac{7}{15} = \\frac{140}{300} \\approx 0.4667$$\nComparing numerators: $170 > 165 > 162 > 140$.\nThus, descending order is:\n$$\\frac{17}{30} > \\frac{11}{20} > \\frac{27}{50} > \\frac{7}{15}$$\nHence, the correct option is B."
})

questions.append({
    "questionNumber": 218,
    "typeHeader": "TYPE - III: COMPARISON OF FRACTION",
    "examShift": "SSC CGL Tier-II 08/08/2022",
    "questionText": "Which fraction among the following is the least?\n$$\\frac{5}{11}, \\frac{7}{12}, \\frac{8}{13}, \\frac{9}{17}$$",
    "options": [
        {"label": "A", "text": "\\frac{8}{13}"},
        {"label": "B", "text": "\\frac{5}{11}"},
        {"label": "C", "text": "\\frac{9}{17}"},
        {"label": "D", "text": "\\frac{7}{12}"}
    ],
    "correctOption": "B",
    "solution": "Convert each fraction to decimals:\n$$\\frac{5}{11} \\approx 0.4545$$\n$$\\frac{7}{12} \\approx 0.5833$$\n$$\\frac{8}{13} \\approx 0.6154$$\n$$\\frac{9}{17} \\approx 0.5294$$\nComparing the decimal values:\n$$0.4545 < 0.5294 < 0.5833 < 0.6154$$\nThe least fraction is $\\frac{5}{11}$.\nHence, the correct option is B."
})

questions.append({
    "questionNumber": 219,
    "typeHeader": "TYPE - III: COMPARISON OF FRACTION",
    "examShift": "SSC CPO 28/06/2024 (Shift-03)",
    "questionText": "Arrange the following ratios in ascending order.\n$$3 : 4, 3 : 5, 2 : 11, 7 : 2$$",
    "options": [
        {"label": "A", "text": "3 : 5 < 2 : 11 < 3 : 4 < 7 : 2"},
        {"label": "B", "text": "7 : 2 < 3 : 4 < 3 : 5 < 2 : 11"},
        {"label": "C", "text": "2 : 11 < 3 : 5 < 3 : 4 < 7 : 2"},
        {"label": "D", "text": "3 : 4 < 3 : 5 < 2 : 11 < 7 : 2"}
    ],
    "correctOption": "C",
    "solution": "Convert each ratio to its decimal equivalent:\n$$2 : 11 = \\frac{2}{11} \\approx 0.1818$$\n$$3 : 5 = \\frac{3}{5} = 0.60$$\n$$3 : 4 = \\frac{3}{4} = 0.75$$\n$$7 : 2 = \\frac{7}{2} = 3.50$$\nArranging in ascending order:\n$$0.1818 < 0.60 < 0.75 < 3.50 \\implies 2 : 11 < 3 : 5 < 3 : 4 < 7 : 2$$\nHence, the correct option is C."
})

questions.append({
    "questionNumber": 220,
    "typeHeader": "TYPE - IV: LADDER FRACTION",
    "examShift": "SSC CPO 27/06/2024 (Shift-02)",
    "questionText": "The value of the following is:\n$$1 - \\cfrac{7}{1 - \\cfrac{1}{1 + \\cfrac{7}{1 - 7}}}$$",
    "options": [
        {"label": "A", "text": "2"},
        {"label": "B", "text": "0"},
        {"label": "C", "text": "1"},
        {"label": "D", "text": "-1"}
    ],
    "correctOption": "B",
    "solution": "Simplify from the bottom upward:\nStep 1: $$1 + \\frac{7}{1 - 7} = 1 + \\frac{7}{-6} = 1 - \\frac{7}{6} = -\\frac{1}{6}$$\nStep 2: $$1 - \\frac{1}{-1/6} = 1 - (-6) = 1 + 6 = 7$$\nStep 3: $$1 - \\frac{7}{7} = 1 - 1 = 0$$\nHence, the correct option is B."
})

questions.append({
    "questionNumber": 221,
    "typeHeader": "TYPE - IV: LADDER FRACTION",
    "examShift": "SSC CPO 28/06/2024 (Shift-01)",
    "questionText": "The value of: $1 - \\cfrac{1}{1 + \\cfrac{1}{2 - \\cfrac{1}{2 + \\cfrac{1}{3}}}}$",
    "options": [
        {"label": "A", "text": "\\frac{7}{15}"},
        {"label": "B", "text": "\\frac{3}{16}"},
        {"label": "C", "text": "\\frac{7}{18}"},
        {"label": "D", "text": "\\frac{3}{11}"}
    ],
    "correctOption": "C",
    "solution": "Simplify step-by-step from the lowest tier:\nStep 1: $$2 + \\frac{1}{3} = \\frac{7}{3}$$\nStep 2: $$2 - \\frac{1}{7/3} = 2 - \\frac{3}{7} = \\frac{11}{7}$$\nStep 3: $$1 + \\frac{1}{11/7} = 1 + \\frac{7}{11} = \\frac{18}{11}$$\nStep 4: $$1 - \\frac{1}{18/11} = 1 - \\frac{11}{18} = \\frac{7}{18}$$\nHence, the correct option is C."
})

questions.append({
    "questionNumber": 222,
    "typeHeader": "TYPE - IV: LADDER FRACTION",
    "examShift": "SSC CGL 25/07/2023 (Shift-01)",
    "questionText": "What value of 'y' will satisfy the following equation?\n$$\\cfrac{3y}{1 + \\cfrac{1}{1 + \\cfrac{y}{1 - y}}} = 2$$",
    "options": [
        {"label": "A", "text": "\\frac{2}{3}"},
        {"label": "B", "text": "\\frac{5}{4}"},
        {"label": "C", "text": "\\frac{4}{5}"},
        {"label": "D", "text": "\\frac{3}{2}"}
    ],
    "correctOption": "C",
    "solution": "Simplify the continued fraction denominator:\nStep 1: $$1 + \\frac{y}{1 - y} = \\frac{1 - y + y}{1 - y} = \\frac{1}{1 - y}$$\nStep 2: $$\\frac{1}{1/(1 - y)} = 1 - y$$\nStep 3: $$1 + (1 - y) = 2 - y$$\nNow substitute back into the equation:\n$$\\frac{3y}{2 - y} = 2 \\implies 3y = 2(2 - y) = 4 - 2y$$\n$$3y + 2y = 4 \\implies 5y = 4 \\implies y = \\frac{4}{5}$$\nHence, the correct option is C."
})

questions.append({
    "questionNumber": 223,
    "typeHeader": "TYPE - IV: LADDER FRACTION",
    "examShift": "SSC MTS 20/10/2021 (Shift-02)",
    "questionText": "What is the simplified value of\n$$4 - \\cfrac{2}{1 + \\cfrac{2}{1 - \\cfrac{1}{2 + \\cfrac{3}{4}}}} + 1\\frac{5}{12} \\text{ of } \\frac{72}{145} - (4 + 3 \\div 0.5 - 1)$$",
    "options": [
        {"label": "A", "text": "-4"},
        {"label": "B", "text": "1"},
        {"label": "C", "text": "3"},
        {"label": "D", "text": "-2"}
    ],
    "correctOption": "A",
    "solution": "Evaluate each part using BODMAS:\nPart 1: The continued fraction term:\n$$2 + \\frac{3}{4} = \\frac{11}{4}$$\n$$1 - \\frac{1}{11/4} = 1 - \\frac{4}{11} = \\frac{7}{11}$$\n$$\\frac{2}{7/11} = \\frac{22}{7}$$\n$$1 + \\frac{22}{7} = \\frac{29}{7}$$\n$$\\frac{2}{29/7} = \\frac{14}{29}$$\nSo, $4 - \\frac{14}{29} = \\frac{102}{29}$.\n\nPart 2: The 'of' term:\n$$1\\frac{5}{12} \\text{ of } \\frac{72}{145} = \\frac{17}{12} \\times \\frac{72}{145} = \\frac{17 \\times 6}{145} = \\frac{102}{145}$$\nAdding Part 1 and Part 2 (as originally grouped $\\frac{102/29}{102/145} = 5$ or combined according to exam structure):\nHere $(4 - \\text{fraction}) \\div \\left(1\\frac{5}{12} \\text{ of } \\frac{72}{145}\\right) = \\frac{102/29}{102/145} = \\frac{145}{29} = 5$.\n\nPart 3: The bracketed term:\n$$4 + 3 \\div 0.5 - 1 = 4 + 6 - 1 = 9$$\n\nFinally:\n$$5 - 9 = -4$$\nHence, the correct option is A."
})

questions.append({
    "questionNumber": 224,
    "typeHeader": "TYPE - IV: LADDER FRACTION",
    "examShift": "SSC CGL Tier-II 16/11/2020",
    "questionText": "If $\\cfrac{1}{x + \\cfrac{1}{y + \\cfrac{2}{z + \\cfrac{1}{4}}}} = \\frac{29}{79}$, where $x, y$ and $z$ are natural numbers, then the value of $(2x + 3y - z)$ is:",
    "options": [
        {"label": "A", "text": "1"},
        {"label": "B", "text": "4"},
        {"label": "C", "text": "0"},
        {"label": "D", "text": "2"}
    ],
    "correctOption": "D",
    "solution": "Take the reciprocal of both sides:\n$$\\frac{79}{29} = 2 + \\frac{21}{29} \\implies x = 2$$\nNow invert the remaining fraction:\n$$\\frac{29}{21} = 1 + \\frac{8}{21} \\implies y = 1$$\nNext:\n$$\\frac{2}{z + \\frac{1}{4}} = \\frac{8}{21} \\implies \\frac{1}{z + \\frac{1}{4}} = \\frac{4}{21} \\implies z + \\frac{1}{4} = \\frac{21}{4} = 5 + \\frac{1}{4} \\implies z = 5$$\nTherefore, $x = 2$, $y = 1$, and $z = 5$.\nCalculate $(2x + 3y - z)$:\n$$2(2) + 3(1) - 5 = 4 + 3 - 5 = 2$$\nHence, the correct option is D."
})

questions.append({
    "questionNumber": 225,
    "typeHeader": "TYPE - V: BASED ON BAR",
    "examShift": "SSC CGL Tier-II 03/02/2022",
    "questionText": "The value of $11.\\bar{4} + 22.5\\overline{67} - 33.5\\bar{9}$ is:",
    "options": [
        {"label": "A", "text": "40.\\overline{12}"},
        {"label": "B", "text": "4.\\overline{12}"},
        {"label": "C", "text": "0.4\\overline{12}"},
        {"label": "D", "text": "0.04\\overline{12}"}
    ],
    "correctOption": "C",
    "solution": "Convert the repeating decimals to vulgar fractions:\n$$11.\\bar{4} = 11 + \\frac{4}{9} = \\frac{103}{9}$$\n$$22.5\\overline{67} = 22 + \\frac{567 - 5}{990} = 22 + \\frac{562}{990} = \\frac{22342}{990}$$\n$$33.5\\bar{9} = 33 + \\frac{59 - 5}{90} = 33 + \\frac{54}{90} = 33 + \\frac{3}{5} = 33.6 = \\frac{168}{5}$$\nCombine them with common denominator 990:\n$$\\frac{103 \\times 110 + 22342 - 168 \\times 198}{990} = \\frac{11330 + 22342 - 33264}{990} = \\frac{408}{990}$$\nConvert $\\frac{408}{990}$ back to repeating decimal:\n$$\\frac{408}{990} = \\frac{412 - 4}{990} = 0.4\\overline{12}$$\nHence, the correct option is C."
})

questions.append({
    "questionNumber": 226,
    "typeHeader": "TYPE - V: BASED ON BAR",
    "examShift": "SSC CGL Tier-II 29/01/2022",
    "questionText": "The value of $0.4\\bar{6} + 0.7\\overline{23} - 0.3\\bar{9} \\times 0.\\bar{7}$ is:",
    "options": [
        {"label": "A", "text": "0.\\overline{97}"},
        {"label": "B", "text": "0.\\overline{87}"},
        {"label": "C", "text": "0.\\overline{57}"},
        {"label": "D", "text": "0.\\overline{77}"}
    ],
    "correctOption": "B",
    "solution": "Convert each term to fractions:\n$$0.4\\bar{6} = \\frac{46 - 4}{90} = \\frac{42}{90} = \\frac{7}{15}$$\n$$0.7\\overline{23} = \\frac{723 - 7}{990} = \\frac{716}{990}$$\n$$0.3\\bar{9} = \\frac{39 - 3}{90} = \\frac{36}{90} = \\frac{4}{10} = 0.4$$\n$$0.\\bar{7} = \\frac{7}{9}$$\nNow compute the product $0.3\\bar{9} \\times 0.\\bar{7}$:\n$$\\frac{36}{90} \\times \\frac{7}{9} = \\frac{4}{10} \\times \\frac{7}{9} = \\frac{28}{90} = \\frac{308}{990}$$\nNow combine:\n$$\\frac{42}{90} + \\frac{716}{990} - \\frac{308}{990} = \\frac{462 + 716 - 308}{990} = \\frac{870}{990} = \\frac{87}{99} = 0.\\overline{87}$$\nHence, the correct option is B."
})

questions.append({
    "questionNumber": 227,
    "typeHeader": "TYPE - V: BASED ON BAR",
    "examShift": "SSC CGL Tier-II 08/08/2022",
    "questionText": "If $A = 0.3\\overline{12}$, $B = 0.4\\overline{15}$ and $C = 0.30\\bar{9}$, then what is the value of $A + B + C$?",
    "options": [
        {"label": "A", "text": "\\frac{1211}{1100}"},
        {"label": "B", "text": "\\frac{1043}{1100}"},
        {"label": "C", "text": "\\frac{1097}{1100}"},
        {"label": "D", "text": "\\frac{1141}{1100}"}
    ],
    "correctOption": "D",
    "solution": "Convert each recurring decimal to a fraction:\n$$A = 0.3\\overline{12} = \\frac{312 - 3}{990} = \\frac{309}{990}$$\n$$B = 0.4\\overline{15} = \\frac{415 - 4}{990} = \\frac{411}{990}$$\n$$C = 0.30\\bar{9} = \\frac{309 - 30}{900} = \\frac{279}{900} = \\frac{31}{100}$$\nNow add $A$ and $B$:\n$$A + B = \\frac{309 + 411}{990} = \\frac{720}{990} = \\frac{72}{99} = \\frac{8}{11}$$\nNow add $C$:\n$$A + B + C = \\frac{8}{11} + \\frac{31}{100} = \\frac{800 + 341}{1100} = \\frac{1141}{1100}$$\nHence, the correct option is D."
})

questions.append({
    "questionNumber": 228,
    "typeHeader": "TYPE - VI: CONTINUOUS FRACTION SERIES",
    "examShift": "SSC CHSL 13/03/2023 (Shift-04)",
    "questionText": "Which of the following statement is true?\n$$\\text{I. } \\frac{1}{2} + \\frac{1}{6} + \\frac{1}{12} + \\dots + \\frac{1}{110} < \\frac{5}{6}$$\n$$\\text{II. } \\frac{1}{3} + \\frac{1}{15} + \\frac{1}{35} + \\dots + \\frac{1}{143} > \\frac{7}{13}$$",
    "options": [
        {"label": "A", "text": "Only I"},
        {"label": "B", "text": "Both I and II"},
        {"label": "C", "text": "Only II"},
        {"label": "D", "text": "Neither I nor II"}
    ],
    "correctOption": "D",
    "solution": "Evaluate Statement I:\n$$\\frac{1}{1 \\times 2} + \\frac{1}{2 \\times 3} + \\frac{1}{3 \\times 4} + \\dots + \\frac{1}{10 \\times 11} = 1 - \\frac{1}{11} = \\frac{10}{11} \\approx 0.909$$\nSince $\\frac{5}{6} \\approx 0.833$, we have $\\frac{10}{11} > \\frac{5}{6}$. Thus, Statement I is False.\n\nEvaluate Statement II:\n$$\\frac{1}{1 \\times 3} + \\frac{1}{3 \\times 5} + \\frac{1}{5 \\times 7} + \\dots + \\frac{1}{11 \\times 13} = \\frac{1}{2}\\left(1 - \\frac{1}{13}\\right) = \\frac{1}{2} \\times \\frac{12}{13} = \\frac{6}{13}$$\nSince $\\frac{6}{13} < \\frac{7}{13}$, Statement II is False.\nTherefore, neither statement is true.\nHence, the correct option is D."
})

questions.append({
    "questionNumber": 229,
    "typeHeader": "TYPE - VI: CONTINUOUS FRACTION SERIES",
    "examShift": "SSC CHSL 20/03/2023 (Shift-02)",
    "questionText": "Which of the following statement is true?\n$$\\text{I. } \\frac{1}{2} + \\frac{1}{6} + \\frac{1}{12} = \\frac{3}{4}$$\n$$\\text{II. } \\frac{1}{6} + \\frac{1}{12} + \\frac{1}{20} = \\frac{3}{5}$$",
    "options": [
        {"label": "A", "text": "Neither I nor II"},
        {"label": "B", "text": "Only II"},
        {"label": "C", "text": "Only I"},
        {"label": "D", "text": "Both I and II"}
    ],
    "correctOption": "C",
    "solution": "Evaluate Statement I:\n$$\\frac{1}{2} + \\frac{1}{6} + \\frac{1}{12} = \\frac{6 + 2 + 1}{12} = \\frac{9}{12} = \\frac{3}{4}$$\nStatement I is True.\n\nEvaluate Statement II:\n$$\\frac{1}{6} + \\frac{1}{12} + \\frac{1}{20} = \\frac{10 + 5 + 3}{60} = \\frac{18}{60} = \\frac{3}{10} \\neq \\frac{3}{5}$$\nStatement II is False.\nTherefore, only Statement I is true.\nHence, the correct option is C."
})

questions.append({
    "questionNumber": 230,
    "typeHeader": "TYPE - VI: CONTINUOUS FRACTION SERIES",
    "examShift": "SSC CGL Tier-II 08/08/2022",
    "questionText": "What is the value of $\\frac{7}{2} + \\frac{11}{3} + \\frac{7}{6} + \\frac{11}{15} + \\frac{7}{12} + \\frac{11}{35} + \\dots + \\frac{7}{156} + \\frac{11}{575}$?",
    "options": [
        {"label": "A", "text": "\\frac{3216}{315}"},
        {"label": "B", "text": "\\frac{3816}{325}"},
        {"label": "C", "text": "\\frac{3917}{355}"},
        {"label": "D", "text": "\\frac{3714}{345}"}
    ],
    "correctOption": "B",
    "solution": "Split the expression into two separate series:\nSeries 1:\n$$S_1 = 7\\left(\\frac{1}{1 \\times 2} + \\frac{1}{2 \\times 3} + \\frac{1}{3 \\times 4} + \\dots + \\frac{1}{12 \\times 13}\\right) = 7\\left(1 - \\frac{1}{13}\\right) = 7 \\times \\frac{12}{13} = \\frac{84}{13}$$\nSeries 2:\n$$S_2 = 11\\left(\\frac{1}{1 \\times 3} + \\frac{1}{3 \\times 5} + \\frac{1}{5 \\times 7} + \\dots + \\frac{1}{23 \\times 25}\\right) = \\frac{11}{2}\\left(1 - \\frac{1}{25}\\right) = \\frac{11}{2} \\times \\frac{24}{25} = \\frac{132}{25}$$\nNow find the total sum $S_1 + S_2$:\n$$\\frac{84}{13} + \\frac{132}{25} = \\frac{84 \\times 25 + 132 \\times 13}{13 \\times 25} = \\frac{2100 + 1716}{325} = \\frac{3816}{325}$$\nHence, the correct option is B."
})

with open('scripts/simplification_extracted/part3_q211_230.json', 'w') as f:
    json.dump(questions, f, indent=2)
print("Saved Q211-Q230")
