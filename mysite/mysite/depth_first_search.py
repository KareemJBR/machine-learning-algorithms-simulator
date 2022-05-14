def dfs(visited_nodes, node):
    if node.node_id not in visited_nodes:
        visited_nodes.append(node)
        for out_edge in node.out_edges:
            dfs(visited_nodes, out_edge.dist_id)
