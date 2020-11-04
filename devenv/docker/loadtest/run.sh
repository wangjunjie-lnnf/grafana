#!/usr/bin/env bash

PWD=$(pwd)

run() {
  duration='15m'
  url='http://localhost:3000'
  vus='2'
  testcase='auth_token_test'
  slowQuery=''
  out=''
  token=''

  while getopts ":d:u:v:c:s:o:t:" o; do
    case "${o}" in
        d)
            duration=${OPTARG}
            ;;
        u)
            url=${OPTARG}
            ;;
        v)
            vus=${OPTARG}
            ;;
        c)
            testcase=${OPTARG}
            ;;
        s)
            slowQuery=${OPTARG}
            ;;
        o)  
            out=${OPTARG}
            ;;
        t)  
            token=${OPTARG}
            ;;

    esac
	done
	shift $((OPTIND-1))

  docker run -t --network=host -v $PWD:/src -e URL=$url -e SLOW_QUERY=$slowQuery -e K6_OUT=$out -e TOKEN=$token --rm -i loadimpact/k6:master run --vus $vus --duration $duration src/$testcase.js
}

run "$@"
