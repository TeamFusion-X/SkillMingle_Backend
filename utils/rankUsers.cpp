#include<bits/stdc++.h>

using namespace std;

int main(){
    string requestFrom;
    int numberOfSkillToTeach = 0;

    cin>>requestFrom>>numberOfSkillToTeach;

    set<string>skillsToTeach;
    for(int i = 0; i < numberOfSkillToTeach; i++){
        string skill;
        cin>>skill;

        skillsToTeach.insert(skill);
    }

    int numUsers = 0;
    cin>>numUsers;

    map<string, set<string>>skillsOf;

    for(int i = 0; i < numUsers; i++){
        string username;
        cin>>username;

        int numberOfSkillToLearn = 0;
        cin>>numberOfSkillToLearn;

        while(numberOfSkillToLearn--){
            string skill;
            cin>>skill;

            if (username != requestFrom){
                skillsOf[username].insert(skill);
            }
        }
    }

    map<string, int>match;
    
    for(auto it : skillsOf){
        string username = it.first;
        for(auto skill : it.second){
            if (skillsToTeach.find(skill) != skillsToTeach.end()){
                match[username]++;
            }
        }
    }

    vector<pair<int, string>>v;
    for(auto it : match) v.push_back({it.second, it.first});

    sort(v.begin(), v.end(), greater<pair<int, string>>());

    for(auto it: v){
        double matchPercentage = 0.0;

        if (numberOfSkillToTeach != 0){
           matchPercentage = (100.00) * it.first/numberOfSkillToTeach;
        }
        
        cout<<it.second<<"--"<<matchPercentage<<" ";
    }
}