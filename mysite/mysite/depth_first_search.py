def dfs(visited_nodes, node):
    if node not in visited_nodes:
        visited_nodes.append(node)
        for neighbour in node.neighbors:
            dfs(visited_nodes, neighbour)


class Node:

    def __init__(self, node_id, neighbors):
        self.node_id = node_id
        self.neighbors = neighbors
