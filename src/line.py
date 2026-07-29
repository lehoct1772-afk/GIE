"""
line.py
Line primitive for the Geometric Intelligence Engine.
"""

from geometry import Point


class Line:
    def __init__(self, start: Point, end: Point):
        self.start = start
        self.end = end

    def length(self):
        return self.start.distance_to(self.end)


if __name__ == "__main__":
    a = Point(0, 0)
    b = Point(3, 4)

    line = Line(a, b)

    print("Start:", line.start)
    print("End:", line.end)
    print("Length:", line.length())