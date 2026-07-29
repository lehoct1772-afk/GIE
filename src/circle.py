"""
circle.py
Circle primitive for the Geometric Intelligence Engine.
"""

from math import pi


class Circle:
    def __init__(self, radius: float):
        self.radius = radius

    def diameter(self):
        return self.radius * 2

    def circumference(self):
        return 2 * pi * self.radius

    def area(self):
        return pi * self.radius ** 2


if __name__ == "__main__":
    c = Circle(5)

    print("Radius:", c.radius)
    print("Diameter:", c.diameter())
    print("Circumference:", round(c.circumference(), 3))
    print("Area:", round(c.area(), 3))