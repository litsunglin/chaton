terraform {
  required_providers {
    docker = {
      source  = "kreuzwerker/docker"
      version = "3.0.2"
    }
  }
}

provider "docker" {}

resource "docker_image" "postgres" {
  name         = "postgres:14"
  keep_locally = true 
}

resource "docker_volume" "postgresql-data" {
  name = "postgresql-data"
}

resource "docker_container" "postgres" {
  image = docker_image.postgres.image_id
  name  = "postgres-chaton"
  restart = "always"
  env = ["POSTGRES_USER=postgres","POSTGRES_PASSWORD=postgres","POSTGRES_DB=postgres"]
  network_mode = "bridge"

  ports {
    internal = 5432
    external = 35432
  }
  mounts {
    type = "volume"
    target = "/var/lib/postgresql/data"
    source = "postgresql-data"
  }
}

output "pgsql_ip" {
  value = docker_container.postgres.network_data[0]["ip_address"]
}

resource "docker_image" "chaton-client" {
  name = "chaton-client"
  build {
    context = "./chat-client"
    tag     = ["chaton-client:latest"]
    #no_cache = true
    build_arg = {
    }
    label = {
      author : "li.tsunglin@gmail.com"
    }
  }
}

resource "docker_container" "chaton-client" {
  image = docker_image.chaton-client.image_id
  name  = "chaton-client-x"
  network_mode = "bridge"

  ports {
    internal = 3000
    external = 30080
  }
}

resource "docker_image" "chaton-server" {
  name = "chaton-server"
  build {
    context = "./server"
    tag     = ["chaton-server:latest"]
    #no_cache = true
    build_arg = {
    }
    label = {
      author : "li.tsunglin@gmail.com"
    }
  }
  triggers = {
    dir_sha1 = sha1(join("", [for f in fileset(path.module, "./server/src/*") : filesha1(f)]))
  }
}

resource "docker_container" "chaton-server" {
  image = docker_image.chaton-server.image_id
  name  = "chaton-server-x"
  env = ["DB_HOST=${docker_container.postgres.network_data[0]["ip_address"]}","DB_PORT=5432"]
  network_mode = "bridge"

  ports {
    internal = 30081
    external = 30081
  }
}

#resource "docker_image" "nginx" {
#  name         = "nginx"
#  keep_locally = true 
#}

#resource "docker_container" "nginx" {
#  image = docker_image.nginx.image_id
#  name  = "tutorial"

#  ports {
#    internal = 80
#    external = 8000
#  }
#}
