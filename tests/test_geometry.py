from src.geometry import Point
from src.line import Line


def test_point_distance():
    a = Point(0, 0)
    b = Point(3, 4)

    assert a.distance_to(b) == 5


def test_line_length():
    a = Point(0, 0)
    b = Point(3, 4)

    line = Line(a, b)

    assert line.length() == 5


if __name__ == "__main__":
    test_point_distance()
    test_line_length()
    print("All geometry tests passed.")