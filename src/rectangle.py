"""
rectangle.py
Rectangle primitive for the Geometric Intelligence Engine.
"""

class Rectangle:
    def __init__(self, width: float, height: float):
        self.width = width
        self.height = height

    def area(self):
        return self.width * self.height

    def perimeter(self):
        return 2 * (self.width + self.height)


if __name__ == "__main__":
    r = Rectangle(10, 5)

    print("Width:", r.width)
    print("Height:", r.height)
    print("Area:", r.area())
    print("Perimeter:", r.perimeter())