class Vertex:

    def __init__(self):
        self.x_position = None
        self.y_position = None
        self.radius = 10.0
        self.out_neighbors = []


class Edge:

    def __init__(self):
        self.source = None
        self.destination = None


class Graph:

    def __init__(self):
        self.edges = []
        self.vertices = []
