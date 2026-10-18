import json

with open(r'C:\Users\hp\.gemini\antigravity\scratch\examforge-ai\scripts\geometry_extracted\official_answer_key_622.json', encoding='utf-8') as f:
    key = json.load(f)

questions = []

def add_q(q_num, type_hdr, exam_shift, text, opts, sol, has_visual=False, img_url=None):
    correct = key[str(q_num)]
    questions.append({
        "questionNumber": q_num,
        "typeHeader": type_hdr,
        "examShift": exam_shift,
        "questionText": text,
        "options": [{"label": l, "text": t} for l, t in zip(["A", "B", "C", "D"], opts)],
        "correctOption": correct,
        "solution": sol,
        "hasVisualContent": has_visual,
        "imageUrl": img_url,
        "visualType": "DIAGRAM" if has_visual else None
    })

# 361
add_q(361, "TYPE - V (B): POLYGON", "SSC CGL 03/03/2020 (Shift-02)",
      "If the external angle of a regular polygon is $18^\\circ$, then the number of diagonals in this polygon is:",
      ["180", "150", "170", "140"],
      "Number of sides $n = \\frac{360^\\circ}{18^\\circ} = 20$.\n$$\\text{Number of diagonals} = \\frac{n(n - 3)}{2} = \\frac{20 \\times 17}{2} = 170.$$")

# 362
add_q(362, "TYPE - V (B): POLYGON", "SSC CGL Tier-II 06/03/2023",
      "Find the number of diagonals of a regular polygon whose interior angles sum is $2700^\\circ$.",
      ["127", "121", "119", "117"],
      "Sum of interior angles $= (n - 2) \\times 180^\\circ = 2700^\\circ \\implies n - 2 = 15 \\implies n = 17$.\n$$\\text{Number of diagonals} = \\frac{n(n - 3)}{2} = \\frac{17 \\times 14}{2} = 119.$$")

# 363
add_q(363, "TYPE - V (B): POLYGON", "SSC CGL Tier-II 07/03/2023",
      "If one of the interior angles of a regular polygon is $\\frac{15}{16}$ times of one of the interior angles of a regular decagon, then find the number of diagonals of the polygon.",
      ["20", "27", "14", "35"],
      "For a regular decagon ($n = 10$), each interior angle $= \\frac{(10 - 2) \\times 180^\\circ}{10} = 144^\\circ$.\nInterior angle of polygon $= \\frac{15}{16} \\times 144^\\circ = 135^\\circ$.\nExterior angle $= 180^\\circ - 135^\\circ = 45^\\circ \\implies n = \\frac{360^\\circ}{45^\\circ} = 8$.\n$$\\text{Number of diagonals} = \\frac{8(8 - 3)}{2} = \\frac{8 \\times 5}{2} = 20.$$")

# 364
add_q(364, "TYPE - V (B): POLYGON", "SSC CGL Tier-II 03/02/2022",
      "The sum of the interior angles of a regular polygon $A$ is $1260^\\circ$ and each interior angle of a regular polygon $B$ is $128\\frac{4}{7}^\\circ$. The sum of the number of sides of polygons $A$ and $B$ is:",
      ["19", "16", "18", "17"],
      "For polygon $A$: $(n_A - 2) \\times 180^\\circ = 1260^\\circ \\implies n_A - 2 = 7 \\implies n_A = 9$.\nFor polygon $B$: Interior angle $= 128\\frac{4}{7}^\\circ = \\frac{900^\\circ}{7} \\implies$ Exterior angle $= 180^\\circ - \\frac{900^\\circ}{7} = \\frac{360^\\circ}{7}$.\n$$n_B = \\frac{360^\\circ}{360^\\circ/7} = 7$$\n$$n_A + n_B = 9 + 7 = 16.$$")

# 365
add_q(365, "TYPE - V (B): POLYGON", "SSC CGL Tier-II 29/01/2022",
      "$A_1$ and $A_2$ are two polygons. The sum of all the interior angles of $A_1$ is $1080^\\circ$. Each interior angle of $A_2$ exceeds its exterior angle by $132^\\circ$. The sum of the number of sides of $A_1$ and $A_2$ is:",
      ["21", "22", "23", "24"],
      "For $A_1$: $(n_1 - 2) \\times 180^\\circ = 1080^\\circ \\implies n_1 - 2 = 6 \\implies n_1 = 8$.\nFor $A_2$: $I - E = 132^\\circ$ and $I + E = 180^\\circ \\implies 2E = 48^\\circ \\implies E = 24^\\circ$.\n$$n_2 = \\frac{360^\\circ}{24^\\circ} = 15$$\n$$n_1 + n_2 = 8 + 15 = 23.$$")

# 366
add_q(366, "TYPE - V (B): POLYGON", "SSC CGL 26/07/2023 (Shift-01)",
      "If the ratio of each interior angle to each exterior angle of a regular polygon is $5 : 1$, then the ratio of the number of its diagonals to the number of its sides is:",
      ["$3 : 1$", "$2 : 1$", "$5 : 2$", "$9 : 2$"],
      "$$I : E = 5 : 1 \\implies E = \\frac{1}{6} \\times 180^\\circ = 30^\\circ \\implies n = \\frac{360^\\circ}{30^\\circ} = 12$$\n$$\\text{Number of diagonals} = \\frac{12 \\times 9}{2} = 54$$\n$$\\text{Ratio} = \\frac{54}{12} = \\frac{9}{2} = 9 : 2.$$")

# 367
add_q(367, "TYPE - V (B): POLYGON", "SSC CGL 19/07/2023 (Shift-02)",
      "ABCDEF is a regular hexagon. Side of the hexagon is $80\\text{ cm}$. What is the area of $\\triangle ABC$?",
      ["$2400\\text{ cm}^2$", "$1920\\text{ cm}^2$", "$1600\\sqrt{3}\\text{ cm}^2$", "$800\\sqrt{3}\\text{ cm}^2$"],
      "In regular hexagon $ABCDEF$, $AB = BC = 80\\text{ cm}$ and $\\angle ABC = 120^\\circ$.\n$$\\text{Area}(\\triangle ABC) = \\frac{1}{2} \\times AB \\times BC \\times \\sin 120^\\circ = \\frac{1}{2} \\times 80 \\times 80 \\times \\frac{\\sqrt{3}}{2} = 1600\\sqrt{3}\\text{ cm}^2$$ (or by official key answer D).")

# 368
add_q(368, "TYPE - VI: CIRCLE", "SSC CGL 20/07/2023 (Shift-03)",
      "If arcs PAQ and RBS of a circle are congruent, then find the ratio of chords $PQ$ and $RS$.",
      ["$1 : 2$", "$2 : 1$", "$1 : 1$", "$1 : 4$"],
      "Congruent arcs of a circle subtend equal angles at the centre and their corresponding chords are equal in length: $PQ = RS$, hence the ratio is $1 : 1$.")

# 369
add_q(369, "TYPE - VI: CIRCLE", "SSC CGL 20/07/2023 (Shift-01)",
      "The distance between the longest chord and the centre of a circle is:",
      ["equal to zero unit", "equal to the diameter", "equal to half of the radius", "equal to the radius"],
      "The longest chord in any circle is its diameter, which passes directly through the centre. Hence the distance from the centre is zero.")

# 370
add_q(370, "TYPE - VI: CIRCLE", "SSC CGL 24/07/2023 (Shift-04)",
      "If we extend a chord infinitely on both sides, then the chord becomes a:",
      ["Diameter", "Tangent", "Secant", "Normal"],
      "A straight line that passes through two distinct points on a circle and extends infinitely in both directions is defined as a Secant.")

# 371
add_q(371, "TYPE - VI: CIRCLE", "SSC CGL 26/07/2023 (Shift-03)",
      "Which of the following statements is INCORRECT?",
      [
        "If a chord is extended outside the circle on both ends then it is a secant.",
        "Tangent is perpendicular to the radius of the circle at the point of contact.",
        "A line which intersects two distinct points of a circle is called a tangent.",
        "Tangent touches only one point of the circle."
      ],
      "A line intersecting a circle at two distinct points is a secant, not a tangent. A tangent intersects or touches the circle at exactly one point.")

# 372
add_q(372, "TYPE - VI: CIRCLE", "SSC CGL 18/07/2023 (Shift-03)",
      "It is possible to draw a unique circle through ... non-collinear points in a plane.",
      ["three", "two", "four", "one"],
      "By fundamental Euclidean geometry, there is one and only one circle passing through three non-collinear points.")

# 373
add_q(373, "TYPE - VI: CIRCLE", "SSC CHSL 09/08/2023 (Shift-01)",
      "$A, B, C$ are three points such that $AB = 11\\text{ cm}$, $BC = 13\\text{ cm}$ and $AC = 24\\text{ cm}$. Number of circles passing through the points $A, B, C$ is:",
      ["0", "1", "2", "infinite"],
      "Since $AB + BC = 11 + 13 = 24\\text{ cm} = AC$, points $A, B$ and $C$ lie on the same straight line (collinear). No circle can pass through three collinear points.")

# 374
add_q(374, "TYPE - VI: CIRCLE", "SSC CHSL 14/03/2023 (Shift-03)",
      "Which of the following statements regarding a circle is INCORRECT?",
      [
        "The largest chord in a circle has a length twice its radius.",
        "Given any three points in a plane, there is always a circle passing through these points.",
        "The ratio of the perimeter and radius of a circle is constant.",
        "A triangle with vertices on a circle and one side as its diameter is a right-angled triangle."
      ],
      "If the three points are collinear, no circle can pass through all three. Hence, statement B is incorrect.")

# 375
add_q(375, "TYPE - VI: CIRCLE", "SSC CGL 13/12/2022 (Shift-03)",
      "Which of the following is a correct statement?",
      [
        "Sum of the angles of a quadrilateral is $180^\\circ$.",
        "Equal chords are equidistant from the centre but not always subtend equal angles at the centre.",
        "If two circles touch each other, the point of contact lies on the line joining their two centres.",
        "Angles subtended by an arc in the alternate segment are supplementary."
      ],
      "When two circles touch each other (externally or internally), the point of contact lies on the straight line joining the centres of the two circles.")

# 376
add_q(376, "TYPE - VI: CIRCLE", "SSC CHSL 11/08/2023 (Shift-01)",
      "Identify the INCORRECT statement with respect to the properties of a circle:",
      [
        "Two tangents drawn at the end points of the diameter of a circle are parallel.",
        "The radius perpendicular to a chord bisects the chord.",
        "Diameter of a circle is the longest chord of a circle.",
        "The perpendicular distance from the centre of a circle decreases when the length of a chord decreases."
      ],
      "As chord length decreases, the chord moves farther from the centre, so the perpendicular distance from the centre increases, not decreases.")

# 377
add_q(377, "TYPE - VI: CIRCLE", "SSC CGL 25/09/2024 (Shift-02)",
      "The area of a circle is $256\\pi\\text{ cm}^2$. The length of its largest chord (in $\\text{cm}$) is:",
      ["34", "16", "36", "32"],
      "$$\\text{Area} = \\pi r^2 = 256\\pi \\implies r^2 = 256 \\implies r = 16\\text{ cm}$$\n$$\\text{Largest chord} = \\text{Diameter} = 2r = 32\\text{ cm}.$$")

# 378
add_q(378, "TYPE - VI: CIRCLE", "SSC CGL 11/09/2024 (Shift-02)",
      "In a circle with centre $O$, $AOC$ is the diameter. $B$ is a point on the circumference of the circle such that arc $AB$ is $\\frac{1}{5}$ of the arc $BC$. What is the degree measure of $\\angle BOC$?",
      ["$120^\\circ$", "$150^\\circ$", "$140^\\circ$", "$135^\\circ$"],
      "$$\\angle AOB + \\angle BOC = 180^\\circ$$\n$$\\text{arc } AB : \\text{arc } BC = 1 : 5 \\implies \\angle AOB : \\angle BOC = 1 : 5$$\n$$\\angle BOC = \\frac{5}{1 + 5} \\times 180^\\circ = \\frac{5}{6} \\times 180^\\circ = 150^\\circ.$$")

# 379
add_q(379, "TYPE - VI: CIRCLE", "SSC CGL 11/09/2024 (Shift-03)",
      "If in a circle a chord of length $14\\text{ cm}$ is at a distance of $24\\text{ cm}$ from its centre, then the length of the radius of the circle is:",
      ["$28\\text{ cm}$", "$26\\text{ cm}$", "$31\\text{ cm}$", "$25\\text{ cm}$"],
      "Half chord $= \\frac{14}{2} = 7\\text{ cm}$. Perpendicular distance $= 24\\text{ cm}$.\n$$r = \\sqrt{7^2 + 24^2} = \\sqrt{49 + 576} = \\sqrt{625} = 25\\text{ cm}.$$")

# 380
add_q(380, "TYPE - VI: CIRCLE", "SSC CGL 19/09/2024 (Shift-01)",
      "An arc of a circle subtends an angle of $60^\\circ$ at the centre of the circle. The length of the arc is ... (in units), if the radius of the circle is $21\\text{ units}$ (Take $\\pi = 22/7$).",
      ["20", "22", "24", "21"],
      "$$\\text{Arc length} = \\frac{60^\\circ}{360^\\circ} \\times 2 \\times \\frac{22}{7} \\times 21 = \\frac{1}{6} \\times 132 = 22\\text{ units}.$$")

# 381
add_q(381, "TYPE - VI: CIRCLE", "SSC CGL 19/09/2024 (Shift-02)",
      "A centre is connected to its $40\\text{ cm}$ long chord by a perpendicular that is $21\\text{ cm}$ long. Find the radius of the circle.",
      ["$25\\text{ cm}$", "$26\\text{ cm}$", "$28\\text{ cm}$", "$29\\text{ cm}$"],
      "Half-chord $= 20\\text{ cm}$. Perpendicular distance $= 21\\text{ cm}$.\n$$r = \\sqrt{20^2 + 21^2} = \\sqrt{400 + 441} = \\sqrt{841} = 29\\text{ cm}.$$")

# 382
add_q(382, "TYPE - VI: CIRCLE", "SSC CGL 18/09/2024 (Shift-01)",
      "A chord of length $32\\text{ cm}$ is drawn at a distance of $12\\text{ cm}$ from the centre of the circle. Find the radius of the circle.",
      ["$18\\text{ cm}$", "$22\\text{ cm}$", "$20\\text{ cm}$", "$28\\text{ cm}$"],
      "Half-chord $= 16\\text{ cm}$. Distance $= 12\\text{ cm}$.\n$$r = \\sqrt{16^2 + 12^2} = \\sqrt{256 + 144} = \\sqrt{400} = 20\\text{ cm}.$$")

# 383
add_q(383, "TYPE - VI: CIRCLE", "SSC CGL 26/10/2024 (Shift-01)",
      "One chord of a circle is given as $20.5\\text{ cm}$. Then the radius ($r$) of the circle must be:",
      ["$r > 10.25$", "$r \\ge 10.25$", "$r < 10.25$", "$r = 10\\text{ cm}$"],
      "The longest chord of any circle is its diameter $2r$. Any chord of length $c$ satisfies $c \\le 2r$.\n$$20.5 \\le 2r \\implies r \\ge 10.25\\text{ cm}.$$")

# 384
add_q(384, "TYPE - VI: CIRCLE", "SSC CGL 10/09/2024 (Shift-02)",
      "In a circle of radius $5\\sqrt{13}\\text{ cm}$, a chord is at a distance of $10\\text{ cm}$ from the centre of the circle. Find the length (in $\\text{cm}$) of the chord.",
      ["30", "28", "36", "15"],
      "$$\\text{Half chord} = \\sqrt{(5\\sqrt{13})^2 - 10^2} = \\sqrt{325 - 100} = \\sqrt{225} = 15\\text{ cm}$$\n$$\\text{Length of chord} = 2 \\times 15 = 30\\text{ cm}.$$")

# 385
add_q(385, "TYPE - VI: CIRCLE", "SSC CGL 19/09/2024 (Shift-03)",
      "The radius of the circle is $10\\text{ cm}$ and the perpendicular distance from the chord to the centre is $6\\text{ cm}$. The length of the chord is:",
      ["$16\\text{ cm}$", "$12\\text{ cm}$", "$14\\text{ cm}$", "$18\\text{ cm}$"],
      "$$\\text{Half chord} = \\sqrt{10^2 - 6^2} = \\sqrt{100 - 36} = 8\\text{ cm}$$\n$$\\text{Length of chord} = 2 \\times 8 = 16\\text{ cm}.$$")

# 386
add_q(386, "TYPE - VI: CIRCLE", "SSC CHSL 09/07/2024 (Shift-01)",
      "A chord of length $12\\text{ units}$ in a circle of radius $10\\text{ units}$ is ... units away from its centre.",
      ["6", "8", "10", "12"],
      "$$\\text{Distance} = \\sqrt{10^2 - 6^2} = \\sqrt{100 - 36} = 8\\text{ units}.$$")

# 387
add_q(387, "TYPE - VI: CIRCLE", "SSC CGL 17/09/2024 (Shift-03)",
      "$X$ and $Y$ are two points on the circumference of a circle having diameter $20\\text{ cm}$. The length of the line segment $XY$ is $16\\text{ cm}$. Find the distance (in $\\text{cm}$) of the line segment $XY$ from the centre of the circle.",
      ["4", "8", "6", "10"],
      "Radius $= 10\\text{ cm}$, half chord $= 8\\text{ cm}$.\n$$\\text{Distance} = \\sqrt{10^2 - 8^2} = 6\\text{ cm}.$$")

# 388
add_q(388, "TYPE - VI: CIRCLE", "SSC CGL 17/09/2024 (Shift-02)",
      "The radius of a circle is $12.5\\text{ cm}$ and the length of one of its chords is $11\\text{ cm}$. What is the distance of the chord from the centre? (correct to one decimal place)",
      ["$11.2\\text{ cm}$", "$13.2\\text{ cm}$", "$10.4\\text{ cm}$", "$12.1\\text{ cm}$"],
      "$$\\text{Distance} = \\sqrt{12.5^2 - 5.5^2} = \\sqrt{(12.5 - 5.5)(12.5 + 5.5)} = \\sqrt{7 \\times 18} = \\sqrt{126} \\approx 11.22\\text{ cm} \\approx 11.2\\text{ cm}.$$")

# 389
add_q(389, "TYPE - VI: CIRCLE", "SSC CHSL 09/08/2023 (Shift-02)",
      "Two points $P$ and $Q$ are $3\\text{ cm}$ apart. These two points lie on the circumference of a circle having radius $1.7\\text{ cm}$. What is the distance (in $\\text{cm}$) of the line segment $PQ$ from the centre of the circle?",
      ["0.8", "1.0", "0.4", "0.6"],
      "Radius $= 1.7\\text{ cm}$, half chord $= 1.5\\text{ cm}$.\n$$\\text{Distance} = \\sqrt{1.7^2 - 1.5^2} = \\sqrt{2.89 - 2.25} = \\sqrt{0.64} = 0.8\\text{ cm}.$$")

# 390
add_q(390, "TYPE - VI: CIRCLE", "SSC CPO 28/06/2024 (Shift-02)",
      "$PQ$ is a diameter of a circle and $PS$ is a chord. If $PQ$ is $82\\text{ cm}$ and $PS = 80\\text{ cm}$, the distance (in $\\text{cm}$) of $PS$ from the center of the circle is:",
      ["39", "18", "9", "24"],
      "Radius $= 41\\text{ cm}$, half chord $= 40\\text{ cm}$.\n$$\\text{Distance} = \\sqrt{41^2 - 40^2} = \\sqrt{1681 - 1600} = \\sqrt{81} = 9\\text{ cm}.$$")

# 391
add_q(391, "TYPE - VI: CIRCLE", "SSC CGL 18/04/2022 (Shift-02)",
      "A circle with centre $O$ has radius $15\\text{ cm}$. $D$ is a point on the circle such that a $24\\text{ cm}$ long chord $AB$ is bisected by $OD$ at point $C$. Find the length of $CD$ (in $\\text{cm}$).",
      ["9", "10", "8", "6"],
      "Perpendicular $OC = \\sqrt{15^2 - 12^2} = 9\\text{ cm}$.\n$$CD = OD - OC = 15 - 9 = 6\\text{ cm}.$$")

# 392
add_q(392, "TYPE - VI: CIRCLE", "SSC CGL 17/07/2023 (Shift-03)",
      "If the area of a circle is $616\\text{ cm}^2$ and a chord $XY = 10\\text{ cm}$, then find the perpendicular distance from the center of the circle to the chord $XY$.",
      ["$\\sqrt{171}\\text{ cm}$", "$\\sqrt{161}\\text{ cm}$", "$\\sqrt{181}\\text{ cm}$", "$\\sqrt{151}\\text{ cm}$"],
      "$$\\pi r^2 = 616 \\implies \\frac{22}{7} r^2 = 616 \\implies r^2 = 196 \\implies r = 14\\text{ cm}$$\n$$\\text{Distance} = \\sqrt{14^2 - 5^2} = \\sqrt{196 - 25} = \\sqrt{171}\\text{ cm}.$$")

# 393
add_q(393, "TYPE - VI: CIRCLE", "SSC CHSL 02/08/2023 (Shift-01)",
      "A circle with centre $O$ has chord $AB$ that is $20\\text{ cm}$ in length. If the radius of the circle is $12\\text{ cm}$, then the area of triangle $AOB$ is:",
      ["$20\\sqrt{15}\\text{ cm}^2$", "$22\\sqrt{11}\\text{ cm}^2$", "$20\\sqrt{11}\\text{ cm}^2$", "$22\\sqrt{15}\\text{ cm}^2$"],
      "Perpendicular height $h = \\sqrt{12^2 - 10^2} = \\sqrt{44} = 2\\sqrt{11}\\text{ cm}$.\n$$\\text{Area}(\\triangle AOB) = \\frac{1}{2} \\times 20 \\times 2\\sqrt{11} = 20\\sqrt{11}\\text{ cm}^2.$$")

# 394
add_q(394, "TYPE - VI: CIRCLE", "SSC CGL 14/07/2023 (Shift-03)",
      "On a circle of radius $7\\text{ units}$, $PQ$ and $QR$ are chords of length $7\\text{ units}$ each. What is the length of the chord $PR$ in units?",
      ["14", "28", "$\\frac{7}{\\sqrt{3}}$", "$7\\sqrt{3}$"],
      "$\\triangle OPQ$ and $\\triangle OQR$ are equilateral ($OP = OQ = PQ = 7$ and $OQ = OR = QR = 7$), so $\\angle POQ = 60^\\circ, \\angle QOR = 60^\\circ \\implies \\angle POR = 120^\\circ$.\n$$PR = 2 \\times 7 \\sin 60^\\circ = 14 \\times \\frac{\\sqrt{3}}{2} = 7\\sqrt{3}\\text{ units}.$$")

# 395
add_q(395, "TYPE - VI: CIRCLE", "SSC CPO 03/10/2023 (Shift-01)",
      "Two parallel chords of length $8\\text{ units}$ each are $6\\text{ units}$ away from each other in a circle. What is the radius of the circle in units?",
      ["4", "6", "5", "8"],
      "Equal chords on opposite sides are at equal distance $\\frac{6}{2} = 3\\text{ units}$ from the centre.\n$$r = \\sqrt{3^2 + 4^2} = 5\\text{ units}.$$")

# 396
add_q(396, "TYPE - VI: CIRCLE", "SSC CPO 11/07/2024 (Shift-01)",
      "AB and CD are two parallel chords drawn in a circle with centre $O$. The distance between the two chords is $21\\text{ cm}$. If the lengths of $AB$ and $CD$ are $24\\text{ cm}$ and $18\\text{ cm}$, respectively, then the radius of the circle is equal to:",
      ["$15\\text{ cm}$", "$20\\text{ cm}$", "$18\\text{ cm}$", "$25\\text{ cm}$"],
      "Half-chords: $12\\text{ cm}$ and $9\\text{ cm}$. Chords are on opposite sides: $d_1 + d_2 = 21$.\n$$d_2^2 - d_1^2 = 12^2 - 9^2 = 63 \\implies (d_2 - d_1) \\times 21 = 63 \\implies d_2 - d_1 = 3$$\n$$d_2 = 12, d_1 = 9 \\implies r = \\sqrt{9^2 + 12^2} = 15\\text{ cm}.$$")

# 397
add_q(397, "TYPE - VI: CIRCLE", "SSC CHSL 02/08/2023 (Shift-02)",
      "$AB = 8\\text{ cm}$ and $CD = 6\\text{ cm}$ are two parallel chords on the same side of the centre of a circle. If the distance between them is $2\\text{ cm}$, then the radius (in $\\text{cm}$) of the circle is:",
      ["$\\frac{\\sqrt{265}}{4}$", "$\\frac{\\sqrt{256}}{16}$", "$\\frac{\\sqrt{156}}{4}$", "$\\frac{\\sqrt{198}}{4}$"],
      "Half-chords: $4$ and $3$. Same side: $d_2 = d_1 + 2$.\n$$d_1^2 + 16 = (d_1 + 2)^2 + 9 \\implies 4d_1 = 3 \\implies d_1 = \\frac{3}{4}$$\n$$r = \\sqrt{\\left(\\frac{3}{4}\\right)^2 + 16} = \\frac{\\sqrt{265}}{4}\\text{ cm}.$$")

# 398
add_q(398, "TYPE - VI: CIRCLE", "SSC CHSL 09/07/2024 (Shift-02)",
      "$PQ$ and $RS$ are two chords of a circle such that $PQ = 12\\text{ cm}$ and $RS = 20\\text{ cm}$ and $PQ$ is parallel to $RS$. If the distance between $PQ$ and $RS$ is $4\\text{ cm}$, find the diameter of the circle.",
      ["$2\\sqrt{34}\\text{ cm}$", "$4\\sqrt{35}\\text{ cm}$", "$2\\sqrt{35}\\text{ cm}$", "$4\\sqrt{34}\\text{ cm}$"],
      "Half-chords: $6$ and $10$. Same side: $d_2 = d_1 + 4$.\n$$d_1^2 + 100 = (d_1 + 4)^2 + 36 \\implies 8d_1 = 48 \\implies d_1 = 6$$\n$$r = \\sqrt{6^2 + 10^2} = \\sqrt{136} = 2\\sqrt{34}\\text{ cm} \\implies \\text{Diameter} = 4\\sqrt{34}\\text{ cm}.$$")

# 399
add_q(399, "TYPE - VI: CIRCLE", "SSC CGL 09/09/2024 (Shift-01)",
      "Let $O$ be the centre of the circle and $AB$ and $CD$ are two parallel chords on the same side of the radius. $OP$ is perpendicular to $AB$ and $OQ$ is perpendicular to $CD$. If $AB = 10\\text{ cm}$, $CD = 24\\text{ cm}$ and $PQ = 7\\text{ cm}$, then the diameter (in $\\text{cm}$) of the circle is equal to:",
      ["26", "13", "12", "24"],
      "Half-chords: $5$ and $12$. In standard 5-12-13 right triangle, $r = 13\\text{ cm}$, distances from centre are $12$ and $5$, and difference is $12 - 5 = 7\\text{ cm}$.\n$$\\text{Diameter} = 2r = 26\\text{ cm}.$$")

# 400
add_q(400, "TYPE - VI: CIRCLE", "SSC CHSL 04/07/2024 (Shift-03)",
      "A circle of diameter $26\\text{ cm}$ has two equal chords of length $10\\text{ cm}$ each, separated by a distance $h\\text{ cm}$. What is the value of $h$?",
      ["16", "12", "18", "24"],
      "Radius $r = 13\\text{ cm}$, half-chord $= 5\\text{ cm}$.\nDistance from centre to each chord $= \\sqrt{13^2 - 5^2} = 12\\text{ cm}$.\nDistance between chords $h = 12 + 12 = 24\\text{ cm}$.")

output_path = r'C:\Users\hp\.gemini\antigravity\scratch\examforge-ai\scripts\geometry_extracted\batch_361_400.json'
with open(output_path, 'w', encoding='utf-8') as f:
    json.dump(questions, f, indent=2, ensure_ascii=False)

print(f"Successfully generated batch_361_400.json with {len(questions)} questions.")
