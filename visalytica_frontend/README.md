## Tecnologias
- Next.js
- Tailwindcss

## Não faça alteração na Main e nem na Dev. 
Deixamos Dev para ser o real ambiente de desenvolvimento, que será enviada para Main apenas quando Dev estiver pronta.
Você deve criar sua branch a partir de dev. Siga os passos abaixo para manter o padrão:

## Instalação

```
git clone https://github.com/CodeBreakers-DASA/visalytica_frontend.git
npm i
git checkout dev
git checkout -b feat/nome_da_sua_branch
npm run dev
```

## Criar PR

Para a criação de PR, você deve dar commit nas suas alterações e manter sua branch atualizada com a qual você quer juntar (normalmente a dev).

```
git add .
git commit -m "feat: alterações"
git push origin nome_da_sua_branch
```

Se por acaso a branch que você quer juntar, tenha atualizações no remoto que você não tenha na sua branch local, você deve:

```
git checkout dev (ou branch que tem que trazer as atualizações remotas pro local)
git pull
git checkout nome_da_sua_branch
git merge dev
```
resolva os conflitos caso tenha
```
git add .
git commit
git push origin nome_da_branch
```

Quando abrir o github, aparecerá algo como "compare & pull request", clique nele, mude a base para a branch que você quer enviar suas alterações (não usar a Main, enviar para Dev). Escreva na descrição o que fez de alteração e envie o PR para ser avaliado.


## Padrão commits e nomes de branchs
- feat: criar nova funcionalidade
- fix: arrumar algo de errado
- remove: removeu algo
- refactor: alterou algo mas continuou com a mesma funcionalidade

## Explicando comandos
- git checkout : vai mudar de branch
- git checkout -b : vai criar uma nova branch a partir da que você está
- git add . : adiciona em coisas prontas pra commitar
- git commit -m "": cria o commit
- git push origin nome_da_branch: envia sua branch pro remoto para criar o PR
- git pull: vai trazer as alterações da branch que voce está
- git merge nome_da_branch: vai trazer as alterações da branch que está em "nome_da_branch" e juntar com sua branch atual
