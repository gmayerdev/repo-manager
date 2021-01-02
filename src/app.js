const express = require("express");
const cors = require("cors");
const { v4: uuid, validate: isUuid } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(
    repositories
    );
});

app.post("/repositories", (request, response) => {
  const {title, url, techs} = request.body;
  const newRespository = {
    id:uuid(),
    title:title,
    url:url,
    techs:techs,
    likes:0
  }
  repositories.push(newRespository);
  response.json(newRespository);
});

app.put("/repositories/:id", (request, response) => {
  const {id} = request.params;
  if(!isUuid(id)){
    return response.status(400).json({error: 'Invalid Id.'});
  }
  const repoIndex = repositories.findIndex(repo => repo.id === id);
  if(repoIndex < 0){
    return response.status(400).json({error: 'Repository does not exist.'});
  }
  const {title, url, techs} = request.body;
  const likes = repositories[repoIndex].likes;
  const repoUpdate = {
      id,
      title,
      url,
      techs,
      likes
  }
  repositories[repoIndex] = repoUpdate;
  return response.json(repoUpdate);
});

app.delete("/repositories/:id", (request, response) => {
  const {id} = request.params;
  if(!isUuid(id)){
    return response.status(400).json({error: 'Invalid Id.'});
  }
  const repoIndex = repositories.findIndex(repo => repo.id === id);
  if(repoIndex < 0){
    return response.status(400).json({error: 'Repository does not exist.'});
  }
  repositories.splice(repoIndex,1);
  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const {id} = request.params;
  if(!isUuid(id)){
    return response.status(400).json({error: 'Invalid Id.'});
  }
  const repoIndex = repositories.findIndex(repo => repo.id === id);
  if(repoIndex < 0){
    return response.status(400).json({error: 'Repository does not exist.'});
  }
  const {title, url, techs} = repositories[repoIndex];
  const likes = repositories[repoIndex].likes + 1;
  const repoLikeUpdate = {
    id:id,
    title:title,
    url:url,
    techs:techs,
    likes:likes
  }
  repositories[repoIndex] = repoLikeUpdate;
  response.json(repoLikeUpdate);
});

module.exports = app;
