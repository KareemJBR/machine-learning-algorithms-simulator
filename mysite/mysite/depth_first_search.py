def dfs(visited_nodes, graph, node):
    if node not in visited_nodes:
        visited_nodes.append(node)
        for neighbour in graph[node]:
            dfs(visited_nodes, graph, neighbour)
