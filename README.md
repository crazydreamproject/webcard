# WebCard
HyperCard on the Web!

# Try out

Visit below site to have a glance of what it is!
  
https://webcard.herokuapp.com/

# Development

## Requirements

Install node.js and docker on your PC.

* https://nodejs.org/
* https://www.docker.com/

Check you have `npm` command after installing node.js.


## Setup

After you've cloned the repository, open Node.js command prompt and go to `frontend/develop` directory and type

```
npm init
```

Do the same for `frontend/publish` and `frontend/market` as well.


## Run frontend

After you've setup, open Node.js command prompt and go to `frontend/develop` directory and type

```
npm run start
```

Visit http://localhost:8181/ on browser.
Now you are ready to develop! 

Edit files under `frontend/develop/src` directory.

Do the same for `frontend/publish` and `frontend/market` as well.
Visit http://localhost:8182/ for publish and http://localhost:8183/ for market frontend.


## Run frontend and backend togather

After you've started frontend apps, open command prompt and go to `backend/django` directory and type

```
docker-compose -f local.yml up
```
Visit http://localhost:8000/ on browser.
It may take a while to first launch server from docker.


# We want you!

If you liked WebCard (or HyperCard!) let's make it better!

WebCard is currently in alpha stage, and many pieces and functionality is missing...
Your help will be greatly appreciated!

Thank You.
---
