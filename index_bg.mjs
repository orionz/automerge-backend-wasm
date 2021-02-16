import * as wasm from './index_bg.wasm';

const lTextDecoder = typeof TextDecoder === 'undefined' ? (0, module.require)('util').TextDecoder : TextDecoder;

let cachedTextDecoder = new lTextDecoder('utf-8', { ignoreBOM: true, fatal: true });

cachedTextDecoder.decode();

let cachegetUint8Memory0 = null;
function getUint8Memory0() {
    if (cachegetUint8Memory0 === null || cachegetUint8Memory0.buffer !== wasm.memory.buffer) {
        cachegetUint8Memory0 = new Uint8Array(wasm.memory.buffer);
    }
    return cachegetUint8Memory0;
}

function getStringFromWasm0(ptr, len) {
    return cachedTextDecoder.decode(getUint8Memory0().subarray(ptr, ptr + len));
}

const heap = new Array(32).fill(undefined);

heap.push(undefined, null, true, false);

let heap_next = heap.length;

function addHeapObject(obj) {
    if (heap_next === heap.length) heap.push(heap.length + 1);
    const idx = heap_next;
    heap_next = heap[idx];

    heap[idx] = obj;
    return idx;
}

function getObject(idx) { return heap[idx]; }

let WASM_VECTOR_LEN = 0;

const lTextEncoder = typeof TextEncoder === 'undefined' ? (0, module.require)('util').TextEncoder : TextEncoder;

let cachedTextEncoder = new lTextEncoder('utf-8');

const encodeString = (typeof cachedTextEncoder.encodeInto === 'function'
    ? function (arg, view) {
    return cachedTextEncoder.encodeInto(arg, view);
}
    : function (arg, view) {
    const buf = cachedTextEncoder.encode(arg);
    view.set(buf);
    return {
        read: arg.length,
        written: buf.length
    };
});

function passStringToWasm0(arg, malloc, realloc) {

    if (realloc === undefined) {
        const buf = cachedTextEncoder.encode(arg);
        const ptr = malloc(buf.length);
        getUint8Memory0().subarray(ptr, ptr + buf.length).set(buf);
        WASM_VECTOR_LEN = buf.length;
        return ptr;
    }

    let len = arg.length;
    let ptr = malloc(len);

    const mem = getUint8Memory0();

    let offset = 0;

    for (; offset < len; offset++) {
        const code = arg.charCodeAt(offset);
        if (code > 0x7F) break;
        mem[ptr + offset] = code;
    }

    if (offset !== len) {
        if (offset !== 0) {
            arg = arg.slice(offset);
        }
        ptr = realloc(ptr, len, len = offset + arg.length * 3);
        const view = getUint8Memory0().subarray(ptr + offset, ptr + len);
        const ret = encodeString(arg, view);

        offset += ret.written;
    }

    WASM_VECTOR_LEN = offset;
    return ptr;
}

let cachegetInt32Memory0 = null;
function getInt32Memory0() {
    if (cachegetInt32Memory0 === null || cachegetInt32Memory0.buffer !== wasm.memory.buffer) {
        cachegetInt32Memory0 = new Int32Array(wasm.memory.buffer);
    }
    return cachegetInt32Memory0;
}

function dropObject(idx) {
    if (idx < 36) return;
    heap[idx] = heap_next;
    heap_next = idx;
}

function takeObject(idx) {
    const ret = getObject(idx);
    dropObject(idx);
    return ret;
}

function debugString(val) {
    // primitive types
    const type = typeof val;
    if (type == 'number' || type == 'boolean' || val == null) {
        return  `${val}`;
    }
    if (type == 'string') {
        return `"${val}"`;
    }
    if (type == 'symbol') {
        const description = val.description;
        if (description == null) {
            return 'Symbol';
        } else {
            return `Symbol(${description})`;
        }
    }
    if (type == 'function') {
        const name = val.name;
        if (typeof name == 'string' && name.length > 0) {
            return `Function(${name})`;
        } else {
            return 'Function';
        }
    }
    // objects
    if (Array.isArray(val)) {
        const length = val.length;
        let debug = '[';
        if (length > 0) {
            debug += debugString(val[0]);
        }
        for(let i = 1; i < length; i++) {
            debug += ', ' + debugString(val[i]);
        }
        debug += ']';
        return debug;
    }
    // Test for built-in
    const builtInMatches = /\[object ([^\]]+)\]/.exec(toString.call(val));
    let className;
    if (builtInMatches.length > 1) {
        className = builtInMatches[1];
    } else {
        // Failed to match the standard '[object ClassName]'
        return toString.call(val);
    }
    if (className == 'Object') {
        // we're a user defined class or Object
        // JSON.stringify avoids problems with cycles, and is generally much
        // easier than looping through ownProperties of `val`.
        try {
            return 'Object(' + JSON.stringify(val) + ')';
        } catch (_) {
            return 'Object';
        }
    }
    // errors
    if (val instanceof Error) {
        return `${val.name}: ${val.message}\n${val.stack}`;
    }
    // TODO we could test for more things here, like `Set`s and `Map`s.
    return className;
}

function _assertClass(instance, klass) {
    if (!(instance instanceof klass)) {
        throw new Error(`expected instance of ${klass.name}`);
    }
    return instance.ptr;
}
/**
* @returns {any}
*/
export function init() {
    var ret = wasm.init();
    return takeObject(ret);
}

/**
* @param {any} input
* @returns {Array<any>}
*/
export function getHeads(input) {
    var ret = wasm.getHeads(addHeapObject(input));
    return takeObject(ret);
}

/**
* @param {any} input
*/
export function free(input) {
    wasm.free(addHeapObject(input));
}

/**
* @param {any} input
* @param {any} change
* @returns {any}
*/
export function applyLocalChange(input, change) {
    var ret = wasm.applyLocalChange(addHeapObject(input), addHeapObject(change));
    return takeObject(ret);
}

/**
* @param {any} input
* @param {Array<any>} changes
* @returns {any}
*/
export function applyChanges(input, changes) {
    var ret = wasm.applyChanges(addHeapObject(input), addHeapObject(changes));
    return takeObject(ret);
}

/**
* @param {any} input
* @param {Array<any>} changes
* @returns {any}
*/
export function loadChanges(input, changes) {
    var ret = wasm.loadChanges(addHeapObject(input), addHeapObject(changes));
    return takeObject(ret);
}

/**
* @param {any} data
* @returns {any}
*/
export function load(data) {
    var ret = wasm.load(addHeapObject(data));
    return takeObject(ret);
}

/**
* @param {any} input
* @returns {any}
*/
export function getPatch(input) {
    var ret = wasm.getPatch(addHeapObject(input));
    return takeObject(ret);
}

/**
* @param {any} input
* @returns {any}
*/
export function clone(input) {
    var ret = wasm.clone(addHeapObject(input));
    return takeObject(ret);
}

/**
* @param {any} input
* @returns {any}
*/
export function save(input) {
    var ret = wasm.save(addHeapObject(input));
    return takeObject(ret);
}

/**
* @param {any} input
* @param {any} have_deps
* @returns {any}
*/
export function getChanges(input, have_deps) {
    var ret = wasm.getChanges(addHeapObject(input), addHeapObject(have_deps));
    return takeObject(ret);
}

/**
* @param {any} input
* @param {any} actorid
* @returns {any}
*/
export function getChangesForActor(input, actorid) {
    var ret = wasm.getChangesForActor(addHeapObject(input), addHeapObject(actorid));
    return takeObject(ret);
}

/**
* @param {any} input
* @returns {any}
*/
export function getMissingDeps(input) {
    var ret = wasm.getMissingDeps(addHeapObject(input));
    return takeObject(ret);
}

/**
*/
export class State {

    static __wrap(ptr) {
        const obj = Object.create(State.prototype);
        obj.ptr = ptr;

        return obj;
    }

    free() {
        const ptr = this.ptr;
        this.ptr = 0;

        wasm.__wbg_state_free(ptr);
    }
}

export const __wbindgen_json_parse = function(arg0, arg1) {
    var ret = JSON.parse(getStringFromWasm0(arg0, arg1));
    return addHeapObject(ret);
};

export const __wbindgen_json_serialize = function(arg0, arg1) {
    const obj = getObject(arg1);
    var ret = JSON.stringify(obj === undefined ? null : obj);
    var ptr0 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len0 = WASM_VECTOR_LEN;
    getInt32Memory0()[arg0 / 4 + 1] = len0;
    getInt32Memory0()[arg0 / 4 + 0] = ptr0;
};

export const __wbindgen_object_drop_ref = function(arg0) {
    takeObject(arg0);
};

export const __wbg_new_ab8c409fa5da73b2 = function() {
    var ret = new Object();
    return addHeapObject(ret);
};

export const __wbg_setheads_e09c34780514be5a = function(arg0, arg1) {
    getObject(arg0).heads = takeObject(arg1);
};

export const __wbg_setfrozen_c6af04af0fd3f847 = function(arg0, arg1) {
    getObject(arg0).frozen = arg1 !== 0;
};

export const __wbg_setstate_ca28681744953036 = function(arg0, arg1) {
    getObject(arg0).state = State.__wrap(arg1);
};

export const __wbg_heads_cf661e9bc9495ca2 = function(arg0) {
    var ret = getObject(arg0).heads;
    return addHeapObject(ret);
};

export const __wbg_frozen_0a95986462f47b20 = function(arg0) {
    var ret = getObject(arg0).frozen;
    return ret;
};

export const __wbg_state_6774d9a5de1b814a = function(arg0) {
    var ret = getObject(arg0).state;
    _assertClass(ret, State);
    var ptr0 = ret.ptr;
    ret.ptr = 0;
    return ptr0;
};

export const __wbg_get_5fa3f454aa041e6e = function(arg0, arg1) {
    var ret = getObject(arg0)[arg1 >>> 0];
    return addHeapObject(ret);
};

export const __wbg_length_d2491466819b6271 = function(arg0) {
    var ret = getObject(arg0).length;
    return ret;
};

export const __wbg_new_9dff83a08f5994f3 = function() {
    var ret = new Array();
    return addHeapObject(ret);
};

export const __wbg_push_3ddd8187ff2ff82d = function(arg0, arg1) {
    var ret = getObject(arg0).push(getObject(arg1));
    return ret;
};

export const __wbg_unshift_8dc02d32587adf7f = function(arg0, arg1) {
    var ret = getObject(arg0).unshift(getObject(arg1));
    return ret;
};

export const __wbg_new_94a7dfa9529ec6e8 = function(arg0, arg1) {
    var ret = new Error(getStringFromWasm0(arg0, arg1));
    return addHeapObject(ret);
};

export const __wbg_buffer_3f12a1c608c6d04e = function(arg0) {
    var ret = getObject(arg0).buffer;
    return addHeapObject(ret);
};

export const __wbg_newwithbyteoffsetandlength_4c51342f87299c5a = function(arg0, arg1, arg2) {
    var ret = new Uint8Array(getObject(arg0), arg1 >>> 0, arg2 >>> 0);
    return addHeapObject(ret);
};

export const __wbg_length_c645e7c02233b440 = function(arg0) {
    var ret = getObject(arg0).length;
    return ret;
};

export const __wbg_new_c6c0228e6d22a2f9 = function(arg0) {
    var ret = new Uint8Array(getObject(arg0));
    return addHeapObject(ret);
};

export const __wbg_set_b91afac9fd216d99 = function(arg0, arg1, arg2) {
    getObject(arg0).set(getObject(arg1), arg2 >>> 0);
};

export const __wbg_instanceof_Uint8Array_fda7b6a64c667462 = function(arg0) {
    var ret = getObject(arg0) instanceof Uint8Array;
    return ret;
};

export const __wbindgen_debug_string = function(arg0, arg1) {
    var ret = debugString(getObject(arg1));
    var ptr0 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len0 = WASM_VECTOR_LEN;
    getInt32Memory0()[arg0 / 4 + 1] = len0;
    getInt32Memory0()[arg0 / 4 + 0] = ptr0;
};

export const __wbindgen_throw = function(arg0, arg1) {
    throw new Error(getStringFromWasm0(arg0, arg1));
};

export const __wbindgen_rethrow = function(arg0) {
    throw takeObject(arg0);
};

export const __wbindgen_memory = function() {
    var ret = wasm.memory;
    return addHeapObject(ret);
};

