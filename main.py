import json
import requests
import os

token = os.environ.get('AUTH_TOKEN')
url = os.environ.get('STRAPI_URL')
headers = {'Authorization': f'Bearer {token}',
           "Content-Type": "application/json",
           }


with open("data.json", "r") as dataFile:
    data = dataFile.read()
    data_js = json.loads(data)

    users = {}
    portfolios = {}
    auth0 = []

    for i in data_js:
        if i["model"] == "users.user":
            users[i["pk"]] = i

        if i["model"] == "portfolio.portfolio":
            users[i["fields"]["user"]]["portfolio"] = i["fields"]
            portfolio = i["fields"]
            data = {}
            data['gender'] = portfolio['gender']
            data['nationality'] = portfolio['nationality']
            data['academic_qualification'] = portfolio['academic_qualification']
            data['mobile'] = portfolio['mobile_number']
            data['is_seeking_job'] = portfolio['is_seeking_job']
            data['is_working'] = portfolio['is_working']
            data['employer'] = portfolio['employer']
            data['years_experience'] = portfolio['years_experience']
            data['github'] = portfolio['github']
            data['linkedin'] = portfolio['linkedin']
            data['personal_site'] = portfolio['personal_site']
            data['about'] = portfolio['about']
            data['proud_project'] = portfolio['proud_project']
            data['user_id'] = int(portfolio['user'])

            if data['gender'] == 'M':
                data['gender'] = 'Male'
            else:
                data['gender'] = 'Female'

            # for k, v in data.items():
            #     if i is None:
            #         del k

            response = requests.post(
                url, headers=headers, data=json.dumps({'data': data}))
            print(data)
            print(response.content)
            # break

    for i in users:
        auth_user = {}
        auth_user['email'] = users[i]['fields']['email']
        auth_user['user_id'] = str(users[i]['pk'])
        auth_user['email_verified'] = True
        auth_user["custom_password_hash"] = {
            "algorithm": "argon2",
            "hash": {
                "value": users[i]['fields']['password'][6:]
            }
        }
        if 'portfolio' in users[i].keys():
            auth_user['name'] = users[i]['portfolio']['first_name'] + ' ' + \
                users[i]['portfolio']['last_name']
        auth0.append(auth_user)

    # with open("out2.json", "w") as outfile:
    #     json.dump(auth0, outfile)
