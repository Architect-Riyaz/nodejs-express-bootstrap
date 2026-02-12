1. Create .dockerignore file in the app directory

2. Test locally first

```
docker-compose -f .\deploy\docker-compose.yml up -d
docker-compose -f .\deploy\docker-compose.yml down -v
```

3. Create host file

```
[web-servers]
production-server ansible_host=199.192.00.000 ansible_user=root ansible_ssh_pass=<ROOT_USER_PASS>
#development-server ansible_host=199.192.00.000 ansible_user=root ansible_ssh_private_key_file=<PEM_FILE>
```

4. Build the images locally first

```
./deploy/init.sh
```

5. Ping servers

```
ansible all -m ping -i deploy/hosts
```

6. Deploy

```
ansible-playbook deploy/playbook.yml -i ./deploy/hosts -l all
```
