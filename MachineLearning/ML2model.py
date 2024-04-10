import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import csv
import seaborn as sb


from sklearn.cluster import KMeans
from sklearn.metrics import silhouette_score
from sklearn.cluster import AgglomerativeClustering
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

from scipy.cluster.hierarchy import fcluster
from scipy.cluster.hierarchy import dendrogram, linkage

if __name__ == "__main__":
    input_file = "MachineLearning/skills-dataset.txt"
    output_file = "MachineLearning/skills-dataset.csv"

    with open(input_file, "r") as file:
        lines = file.readlines()

    data = []
    for line in lines:
        parts = line.strip().split(" - ")
        if len(parts) == 2:
            word, description = parts
            data.append((word.strip(), description.strip()))
        

    with open(output_file, "w", newline="", encoding="utf-8") as file:
        writer = csv.writer(file)
        writer.writerow(["Word", "Description"])
        writer.writerows(data)
    print(f"Conversion completed. Output written to {output_file}")


    csv_file = "MachineLearning/skills-dataset.csv"
    
    # Read the CSV file
    df = pd.read_csv(csv_file)

    # Sort
    df.sort_values(by='Word', inplace=True)

    # Write back to the same CSV file
    df.to_csv(csv_file, index=False)
    
    df = pd.read_csv(csv_file)

    words = []
    descriptions = []
    for i in df.index:
        words.append(df['Word'][i].lower())
        descriptions.append(df['Description'][i])


    try:  

        # Vectorize descriptions using TF-IDF
        vectorizer = TfidfVectorizer()

        X = vectorizer.fit_transform(descriptions)

        # Compute cosine similarity matrix
        cosine_sim = cosine_similarity(X)

        # Perform hierarchical clustering
        linkage_matrix = linkage(cosine_sim, 'ward')

        # Plot dendrogram
        # plt.figure(figsize=(10, 7))
        # plt.title('Hierarchical Clustering Dendrogram')
        # dendrogram(linkage_matrix, leaf_font_size=4)
        # plt.xticks(rotation=90)
        # plt.show()

        # Separate clusters up to a level
        max_d = 1.6  # Threshold distance
        clusters = fcluster(linkage_matrix, max_d, criterion='distance')

        # for word, cluster in zip(words, clusters):
        #     print(f"{word}: Cluster {cluster}")
        
        # Dictionary to store cluster number
        cluster_dict = {}
        for word, cluster in zip(words, clusters):
            cluster_dict[word] = cluster
        
        csv_file_path = "MachineLearning\cluster_data.csv"

        with open(csv_file_path, 'w', newline='') as csvfile:
            writer = csv.writer(csvfile)
            writer.writerow(['Word', 'Cluster'])
            for word, cluster in cluster_dict.items():
                writer.writerow([word, cluster])

        print("Suggestions Dataset Updated Succesfully")
        
    except Exception as e: print(e)