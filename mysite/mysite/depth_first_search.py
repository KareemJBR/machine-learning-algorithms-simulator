class Edge:

    def __init__(self, edge_id: int, src_id, dist_id):
        self.edge_id = edge_id
        self.src_id = src_id
        self.dist_id = dist_id


class Node:

    def __init__(self, node_id: int, in_edges: list, out_edges: list):
        self.node_id = node_id
        self.in_edges = in_edges
        self.out_edges = out_edges


# class Graph:
#
#     def __init__(self, head_id: int, nodes: list, edges: list):
#         self.head_id = head_id
#         self.edges = edges
#         self.nodes = nodes
#

def dfs(visited_nodes, node):
    if node.node_id not in visited_nodes:
        visited_nodes.append(node)
        for out_edge in node.out_edges:
            dfs(visited_nodes, out_edge.dist_id)
