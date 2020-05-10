'use strict';

export const types = {
	u8: (offset, isSetter) => [`.${isSetter ? 'get' : 'set'}Uint8(${offset});`, 1],

};

export function makeParser(ocList) {

}

export function makeBuilders(ocList) {

}