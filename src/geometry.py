"""
geometry.py
Core geometric primitives for the Geometric Intelligence Engine.
"""

from math import sqrt


class Point:
    def __init__(self, x: float, y: float):
        self.x = x
        self.y = y

    def distance_to(self, other):
        return sqrt((other.x - self.x) ** 2 + (other.y - self.y) ** 2)

    def __repr__(self):
        return f"Point({self.x}, {self.y})"


if __name__ == "__main__":
    a = Point(0, 0)
    b = Point(3, 4)

    print(a)
    print(b)
    print("Distance:", a.distance_to(b))