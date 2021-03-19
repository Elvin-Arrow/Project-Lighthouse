import unittest
from factorial import fact

class TestFactorial(unittest.TestCase):
    """
    Our basic test class
    """

    def test_fact_1(self):
        """
        The actual test.
        Any method which starts with ``test_`` will considered as a test case.
        """
        res = fact(5)
        self.assertEqual(res, 120)

    def test_fact_2(self):

        res = fact(10)
        self.assertEqual(res, 3628800)


if __name__ == '__main__':
    unittest.main()