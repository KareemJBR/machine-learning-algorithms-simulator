from numpy import sqrt


def k_nearest_neighbors(k, input_points, input_points_class, output_points):
    """

        :param k: The k parameter in the algorithm k-nearest-neighbors
        :param input_points: The points in the training data, each point has two coordinates, x and y. In addition,
        it has the id of the class it is in
        :param input_points_class: The input points' classification vector
        :param output_points: A vector containing the test data.
        :return: A list of the same length of the test data indicating the classes the algorithm decides for the points
        in `output_points` in the output window

    """

    results = []
    if len(input_points) == 0:
        raise ValueError("Invalid training data.")

    d = len(input_points[0])
    for test_point in output_points:
        distances = []

        for i in range(len(input_points)):
            distance = 0
            for feature in range(d):
                distance += pow(input_points[i][feature] - test_point[feature], 2)
            distances.append((sqrt(distance), input_points_class[i]))

        distances.sort(key=lambda x: x[0])

        k_closest = []
        for i in range(k):
            k_closest.append(distances[i][1])

        for i in range(k, len(distances)):
            if distances[i][0] == k_closest[k - 1]:
                k_closest.append(distances[i][1])

        most_common = None
        times_appeared = 0

        for i in range(len(k_closest)):
            temp = k_closest.count(k_closest[i])
            if temp > times_appeared:
                most_common = k_closest[i]
                times_appeared = temp

        for i in range(len(k_closest)):
            if most_common != k_closest[i] and times_appeared == k_closest.count(k_closest[i]):     # the algorithm
                #   cannot decide which class is the right one
                most_common = None
                break

        results.append(most_common)

    return results
