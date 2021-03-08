create schema `swapinode`;

use swapinode;

create table swperson (
	id int not null primary key,
	charname varchar(255) not null,
	gender varchar(50),
    homeworld varchar(255),
    species varchar(255),
    url varchar(255) not null
);