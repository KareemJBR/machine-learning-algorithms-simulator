from numpy import sqrt


def distance_sort(point_distance: tuple) -> float:
    """Used in sorting a list of tuples"""
    return point_distance[0]


def k_nearest_neighbors(k: int, input_points: list, width: int, height: int) -> list:
    """

    :param k: The k parameter in the algorithm k-nearest-neighbors
    :param input_points: The points in the training data, each point has two coordinates, x and y. In addition,
    it has the id of the class it is in
    :param width: The width of the output window
    :param height: The height of the output window
    :return: A list of ints of the size width * height indicating the classes the algorithm decides for the pixels in
    the output window

    """

    results = []

    for x_coordinate in range(width):
        for y_coordinate in range(height):

            distance_list = []  # list of tuples where each tuple contains the distance from an input point and its
            # class
            for input_point in input_points:
                train_x = input_point[0]
                train_y = input_point[1]
                train_class = input_point[2]

                distance = sqrt(pow(train_x - x_coordinate, 2) + pow(train_y + y_coordinate, 2))
                distance_list.append((distance, train_class))

            # we shall now find the classes of the k nearest neighbors

            distance_list.sort(key=distance_sort)

            classes_counter = {}

            for i in range(k):
                train_class = distance_list[i][1]

                if train_class in classes_counter.keys():
                    classes_counter[train_class] += 1
                else:
                    classes_counter[train_class] = 1

            max_class = 0
            max_appearances = 0

            for class_index, number_of_points in classes_counter.items():
                if number_of_points > max_appearances:
                    max_appearances = number_of_points
                    max_class = class_index

            # we should check if there is another class with the same number of near pixels, if yes then we append -1,
            # which means that the algorithm cannot decide what class should the pixel assigned to

            for class_index, number_of_points in classes_counter.items():
                if number_of_points == max_class:
                    max_class = -1
                    break

            results.append(max_class)
    return results
