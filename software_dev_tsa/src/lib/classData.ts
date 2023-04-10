import { atom, Atom, Getter, Setter } from "jotai";
import { useEffect, useState }  from 'react'
import loadable from 'jotai/utils'

// type interfaces
export interface Lecture {
    Id: number,
    ClassID: number,
    Name: string,
    Description: string,
    Isstopped: boolean,
    CreationDate: Date
}

export interface CreateLectureData {
    name: string,
    description: string,
    classID: number
}

export interface ClassData {
    lectures: Lecture[]
}