from dfs_objects import *


def depth_first_search(graph: Graph, curr_point: Vertex, visited_vertices: set):
    if curr_point not in graph.vertices:
        raise ValueError("Start Point is not in the graph")

    # if we reach this line then the start point is legal
    #   light_up(curr_point)
    print(curr_point.x_position, curr_point.y_position, sep=" , ")  # TODO: instead of printing, we will light the
    # TODO: vertex we are in at every moment, so will we do for the edges
    for neighbor in curr_point.out_neighbors:
        if neighbor not in visited_vertices:
            visited_vertices.add(neighbor)
            depth_first_search(graph, neighbor, visited_vertices)
