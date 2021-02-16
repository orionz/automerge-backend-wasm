/* tslint:disable */
/* eslint-disable */
/**
* @returns {any}
*/
export function init(): any;
/**
* @param {any} input
* @returns {Array<any>}
*/
export function getHeads(input: any): Array<any>;
/**
* @param {any} input
*/
export function free(input: any): void;
/**
* @param {any} input
* @param {any} change
* @returns {any}
*/
export function applyLocalChange(input: any, change: any): any;
/**
* @param {any} input
* @param {Array<any>} changes
* @returns {any}
*/
export function applyChanges(input: any, changes: Array<any>): any;
/**
* @param {any} input
* @param {Array<any>} changes
* @returns {any}
*/
export function loadChanges(input: any, changes: Array<any>): any;
/**
* @param {any} data
* @returns {any}
*/
export function load(data: any): any;
/**
* @param {any} input
* @returns {any}
*/
export function getPatch(input: any): any;
/**
* @param {any} input
* @returns {any}
*/
export function clone(input: any): any;
/**
* @param {any} input
* @returns {any}
*/
export function save(input: any): any;
/**
* @param {any} input
* @param {any} have_deps
* @returns {any}
*/
export function getChanges(input: any, have_deps: any): any;
/**
* @param {any} input
* @param {any} actorid
* @returns {any}
*/
export function getChangesForActor(input: any, actorid: any): any;
/**
* @param {any} input
* @returns {any}
*/
export function getMissingDeps(input: any): any;
/**
*/
export class State {
  free(): void;
}
