import numpy as np
import pandas as pd


class NaiveBayes:
    """
    Bayes Theorem form
    P(y|X) = P(X|y) * P(y) / P(X)
    """

    def calc_prior(self, features, target):
        """Calculates prior probabilities P(y)"""
        self.prior = (
            features.groupby(target).apply(lambda x: len(x)) / self.rows
        ).to_numpy()
        return self.prior

    def calc_statistics(self, features, target):
        """Calculates mean, variance for each column and convert to numpy array"""
        self.mean = features.groupby(target).apply(np.mean).to_numpy()
        self.var = features.groupby(target).apply(np.var).to_numpy()
        return self.mean, self.var

    def gaussian_density(self, class_idx, x):
        """
        Calculates probability from gaussian density function (normally distributed).
        We assume that probability of specific target value given specific class is normally distributed

        probability density function derived from wikipedia:
        (1/√2pi*σ) * exp((-1/2)*((x-μ)^2)/(2*σ²)), where μ is mean, σ² is variance, σ is quare root of variance (standard deviation)
        """
        mean = self.mean[class_idx]
        var = self.var[class_idx]
        numerator = np.exp((-1 / 2) * ((x - mean) ** 2) / (2 * var))
        denominator = np.sqrt(2 * np.pi * var)
        prob = numerator / denominator
        return prob

    def calc_posterior(self, x):
        posteriors = []
        # calculate posterior probability for each class
        for i in range(self.count):
            prior = np.log(
                self.prior[i]
            )  ## use the log to make it more numerically stable
            conditional = np.sum(
                np.log(self.gaussian_density(i, x))
            )  # use the log to make it more numerically stable
            posterior = prior + conditional
            posteriors.append(posterior)
        # return class with highest posterior probability
        return self.classes[np.argmax(posteriors)]

    def fit(self, features, target):
        self.classes = np.unique(target)
        self.count = len(self.classes)
        self.feature_nums = features.shape[1]
        self.rows = features.shape[0]

        self.calc_statistics(features, target)
        self.calc_prior(features, target)

    def predict(self, features):
        preds = [self.calc_posterior(f) for f in features.to_numpy()]
        return preds

    def accuracy(self, y_test, y_pred):
        accuracy = np.sum(y_test == y_pred) / len(y_test)
        return accuracy

    def get_formatted_predicted_values(self, y_pred, target):
        pr = pd.DataFrame(data=y_pred, columns=[target])
        predicted_dict = pr.value_counts(dropna=False).to_dict()
        return predicted_dict
