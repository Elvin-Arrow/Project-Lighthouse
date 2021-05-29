
def fact(n):
    if n == 0:
        return 1
    return n * fact(n -1)

def main(n):
    res = fact(n)
    print(res)


print(fact(5))