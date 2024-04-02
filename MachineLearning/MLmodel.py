# print("Python file Connected successfully");

from pymongo import MongoClient

def get_user_data():
    # Connect to MongoDB
    client = MongoClient('mongodb://localhost:27017/')
    
    # DB = process.env.DATABASE_LOCAL
    # client = MongoClient(DB)
    db = client['skillMingle']
    users_collection = db['users']

    user_data = users_collection.find({}, {'_id': 0, 'username': 1, 'skillsToTeach': 1, 'skillsToLearn': 1})

    return user_data

import sys
from collections import Counter
from collections import Counter

def closeness_factor(array1, array2):
    counter1 = Counter(array1)
    counter2 = Counter(array2)
    
    common_count = sum(min(counter1[val], counter2[val]) for val in set(array1) & set(array2) if val != 0)
    
    return common_count


import csv

def load_cluster_data(csv_file_path):
    cluster_dict = {}
    
    try:
        with open(csv_file_path, 'r') as csvfile:
            reader = csv.reader(csvfile)
            next(reader)
            for row in reader:
                word, cluster = row
                cluster_dict[word] = int(cluster) 
        return cluster_dict
    
    except Exception as e:
        print("Data Loading Error")
        return None

def convert(array,cluster_dict):
    
    for i in range(len(array)):
        try:
            array[i] = cluster_dict[array[i]]
        except KeyError:
            array[i] = 0
    return array

if __name__ == "__main__":
    try:
        users_cursor = get_user_data()
        
        users = list(users_cursor)

        root_user = str(sys.argv[1]).strip()
        root_user_skillsToLearn = str(sys.argv[2]).split()
        root_user_skillsToTeach = str(sys.argv[3]).split()

        csv_file_path = "MachineLearning\cluster_data.csv"
        cluster_dict = load_cluster_data(csv_file_path)


        root_user_skillsToTeach = convert(root_user_skillsToTeach, cluster_dict)
        root_user_skillsToLearn = convert(root_user_skillsToLearn, cluster_dict)

        queue = []
        for i in range(len(users)):
            current_user = users[i]['username'].strip()
            current_user_skillsToLearn = users[i]['skillsToLearn']
            current_user_skillsToTeach = users[i]['skillsToTeach']

            if current_user==root_user:
                continue

            current_user_skillsToLearn = convert(current_user_skillsToLearn, cluster_dict)
            current_user_skillsToTeach = convert(current_user_skillsToTeach, cluster_dict)

            cnt1 = closeness_factor(root_user_skillsToLearn, current_user_skillsToTeach)
            cnt2 = closeness_factor(current_user_skillsToLearn, root_user_skillsToTeach)
            
            queue.append((current_user,cnt1+cnt2))

        queue = sorted(queue, key=lambda x: x[1], reverse=True)

        for item in queue:
            print(item[0],end = " ")


    except Exception as e: print(e)