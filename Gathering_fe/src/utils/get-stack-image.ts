import flutter from '@/assets/stackIcons/Flutter-Light.svg';
import figma from '@/assets/stackIcons/Figma.svg';
import spring from '@/assets/stackIcons/Spring-Light.svg';
import angular from '@/assets/stackIcons/Angular-Light.svg';
import aws from '@/assets/stackIcons/AWS-Light.svg';
import c from '@/assets/stackIcons/C.svg';
import cpp from '@/assets/stackIcons/CPP.svg';
import cloudflare from '@/assets/stackIcons/Cloudflare-Light.svg';
import cs from '@/assets/stackIcons/CS.svg';
import css from '@/assets/stackIcons/CSS.svg';
import dart from '@/assets/stackIcons/Dart-Light.svg';
import django from '@/assets/stackIcons/Django.svg';
import docker from '@/assets/stackIcons/Docker.svg';
import emotion from '@/assets/stackIcons/Emotion-Light.svg';
import fastApi from '@/assets/stackIcons/FastAPI.svg';
import firebase from '@/assets/stackIcons/Firebase-Light.svg';
import flask from '@/assets/stackIcons/Flask-Light.svg';
import expressJs from '@/assets/stackIcons/ExpressJS-Light.svg';
import fortran from '@/assets/stackIcons/Fortran.svg';
import gcp from '@/assets/stackIcons/GCP-Light.svg';
import git from '@/assets/stackIcons/Git.svg';
import graphQl from '@/assets/stackIcons/GraphQL-Light.svg';
import html from '@/assets/stackIcons/HTML.svg';
import illustrator from '@/assets/stackIcons/Illustrator.svg';
import java from '@/assets/stackIcons/Java-Light.svg';
import javascript from '@/assets/stackIcons/JavaScript.svg';
import kotlin from '@/assets/stackIcons/Kotlin-Light.svg';
import matlab from '@/assets/stackIcons/Matlab-Light.svg';
import mongoDb from '@/assets/stackIcons/MongoDB.svg';
import mySql from '@/assets/stackIcons/MySQL-Light.svg';
import nestJs from '@/assets/stackIcons/NestJS-Light.svg';
import nodeJs from '@/assets/stackIcons/NodeJS-Light.svg';
import nextJs from '@/assets/stackIcons/NextJS-Light.svg';
import nuxtJs from '@/assets/stackIcons/NuxtJS-Light.svg';
import photoshop from '@/assets/stackIcons/Photoshop.svg';
import postgreSql from '@/assets/stackIcons/PostgreSQL-Light.svg';
import postman from '@/assets/stackIcons/Postman.svg';
import premiere from '@/assets/stackIcons/Premiere.svg';
import python from '@/assets/stackIcons/Python-Light.svg';
import react from '@/assets/stackIcons/React-Light.svg';
import typescript from '@/assets/stackIcons/TypeScript.svg';
import r from '@/assets/stackIcons/R-Light.svg';
import rust from '@/assets/stackIcons/Rust.svg';
import sass from '@/assets/stackIcons/Sass.svg';
import php from '@/assets/stackIcons/PHP-Light.svg';
import sqlite from '@/assets/stackIcons/SQLite.svg';
import supabase from '@/assets/stackIcons/Supabase-Light.svg';
import svelte from '@/assets/stackIcons/Svelte.svg';
import swift from '@/assets/stackIcons/Swift.svg';
import tailwindCss from '@/assets/stackIcons/TailwindCSS-Light.svg';
import unity from '@/assets/stackIcons/Unity-Light.svg';
import unrealEngine from '@/assets/stackIcons/UnrealEngine.svg';
import vercel from '@/assets/stackIcons/Vercel-Light.svg';
import vite from '@/assets/stackIcons/Vite-Light.svg';
import vue from '@/assets/stackIcons/Vue.svg';
import vueJs from '@/assets/stackIcons/VueJS-Light.svg';
import azure from '@/assets/stackIcons/Azure-Light.svg';
import kubernetes from '@/assets/stackIcons/Kubernetes.svg';

export function getStackImage(stack: string) {
  switch (stack) {
    case 'FLUTTER':
      return flutter;
    case 'FIGMA':
      return figma;
    case 'SPRING':
      return spring;
    case 'ANGULAR':
      return angular;
    case 'AWS':
      return aws;
    case 'C':
      return c;
    case 'CPP':
      return cpp;
    case 'CLOUDFLARE':
      return cloudflare;
    case 'CS':
      return cs;
    case 'CSS':
      return css;
    case 'DART':
      return dart;
    case 'DJANGO':
      return django;
    case 'DOCKER':
      return docker;
    case 'EMOTION':
      return emotion;
    case 'FASTAPI':
      return fastApi;
    case 'FIREBASE':
      return firebase;
    case 'FLASK':
      return flask;
    case 'EXPRESSJS':
      return expressJs;
    case 'FORTRAN':
      return fortran;
    case 'GCP':
      return gcp;
    case 'GIT':
      return git;
    case 'GRAPHQL':
      return graphQl;
    case 'HTML':
      return html;
    case 'ILLUSTRATOR':
      return illustrator;
    case 'JAVA':
      return java;
    case 'JAVASCRIPT':
      return javascript;
    case 'KOTLIN':
      return kotlin;
    case 'MATLAB':
      return matlab;
    case 'MONGODB':
      return mongoDb;
    case 'MYSQL':
      return mySql;
    case 'NESTJS':
      return nestJs;
    case 'NODEJS':
      return nodeJs;
    case 'NEXTJS':
      return nextJs;
    case 'NUXTJS':
      return nuxtJs;
    case 'PHOTOSHOP':
      return photoshop;
    case 'POSTGRESQL':
      return postgreSql;
    case 'POSTMAN':
      return postman;
    case 'PREMIERE':
      return premiere;
    case 'PYTHON':
      return python;
    case 'REACT':
      return react;
    case 'TYPESCRIPT':
      return typescript;
    case 'R':
      return r;
    case 'RUST':
      return rust;
    case 'SASS':
      return sass;
    case 'PHP':
      return php;
    case 'SQLITE':
      return sqlite;
    case 'SUPABASE':
      return supabase;
    case 'SVELTE':
      return svelte;
    case 'SWIFT':
      return swift;
    case 'TAILWINDCSS':
      return tailwindCss;
    case 'UNITY':
      return unity;
    case 'UNREALENGINE':
      return unrealEngine;
    case 'VERCEL':
      return vercel;
    case 'VITE':
      return vite;
    case 'VUE':
      return vue;
    case 'VUEJS':
      return vueJs;
    case 'AZURE':
      return azure;
    case 'KUBERNETES':
      return kubernetes;
    default:
      return null;
  }
}
