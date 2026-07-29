"""
math_utils.py
Shared mathematical utilities for the Geometric Intelligence Engine.
"""

from math import pi, sqrt


def distance(x1, y1, x2, y2):
    return sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2)


def degrees_to_radians(degrees):
    return degrees * pi / 180


def radians_to_degrees(radians):
    return radians * 180 / pi


if __name__ == "__main__":
    print("Distance:", distance(0, 0, 3, 4))
    print("90° =", degrees_to_radians(90), "radians")
    print("π radians =", radians_to_degrees(pi), "degrees")