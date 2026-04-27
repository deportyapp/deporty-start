export const ALPHABET = 'ABCDEFGHIJKLMN\u00D1OPQRSTUVWXYZ0123456789 .,;:!?()-';
export const RUN_DELAY_MS = 120;
export const AUTO_STEPS_PER_TICK = 6;
export const MAX_TRACE_LINES = 500;
export const MS_PER_DAY = 86400000;
export const BLANK_SYMBOL = '_';
export const DIVIDER_SYMBOL = '|';

export type MachineState =
	| 'qRead'
	| 'qDecode'
	| 'qSeekDivider'
	| 'qSeekOutput'
	| 'qWrite'
	| 'qReturn'
	| 'qMove'
	| 'qH';

export type MachineRuntime = {
	currentState: MachineState;
	headIndex: number;
	readSymbol: string;
	writtenSymbol: string;
	stepCount: number;
	machineTape: string[];
	dividerIndex: number;
	inputCursor: number;
	halted: boolean;
	pendingDecoded: string;
	machineKey: number;
	machineOriginalText: string;
	machineEncryptedText: string;
	finalMessage: string;
};

export type StepResult = {
	runtime: MachineRuntime;
	traceLines: string[];
	completion?: {
		message: string;
		isMatch: boolean;
	};
};

export const STATE_LABELS: Record<MachineState, string> = {
	qRead: 'Leer',
	qDecode: 'Descifrar',
	qSeekDivider: 'Buscar separador',
	qSeekOutput: 'Buscar espacio',
	qWrite: 'Escribir',
	qReturn: 'Volver',
	qMove: 'Ir al siguiente',
	qH: 'Fin'
};

export const normalizeMessage = (value: string) =>
	value
		.toUpperCase()
		.replace(/[\u00C1\u00C0\u00C4\u00C2]/g, 'A')
		.replace(/[\u00C9\u00C8\u00CB\u00CA]/g, 'E')
		.replace(/[\u00CD\u00CC\u00CF\u00CE]/g, 'I')
		.replace(/[\u00D3\u00D2\u00D6\u00D4]/g, 'O')
		.replace(/[\u00DA\u00D9\u00DC\u00DB]/g, 'U');

const getTodayUtcStartMs = () => {
	const now = new Date();
	return Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
};

const parseIsoDateToUtcStartMs = (dateStr: string) => {
	if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
		return null;
	}

	const [yearStr, monthStr, dayStr] = dateStr.split('-');
	const year = Number(yearStr);
	const month = Number(monthStr);
	const day = Number(dayStr);
	const utcMs = Date.UTC(year, month - 1, day);
	const checkDate = new Date(utcMs);

	if (
		checkDate.getUTCFullYear() !== year ||
		checkDate.getUTCMonth() !== month - 1 ||
		checkDate.getUTCDate() !== day
	) {
		return null;
	}

	return utcMs;
};

export const getDailyNumber = (referenceDateStr: string) => {
	const refMs = parseIsoDateToUtcStartMs(referenceDateStr);
	if (refMs === null) {
		throw new TypeError('Fecha invalida. Usa YYYY-MM-DD.');
	}

	return Math.floor((getTodayUtcStartMs() - refMs) / MS_PER_DAY);
};

export const getCodeFromDate = (referenceDateStr: string) => {
	const daily = getDailyNumber(referenceDateStr);
	const range = ALPHABET.length - 1;
	return (daily % range) + 1;
};

export const shiftChar = (char: string, shift: number) => {
	const index = ALPHABET.indexOf(char);
	if (index === -1) {
		return char;
	}

	const size = ALPHABET.length;
	const shifted = (((index + shift) % size) + size) % size;
	return ALPHABET[shifted];
};

export const encryptMessage = (message: string, key: number) => {
	const normalized = normalizeMessage(message);
	return Array.from(normalized, (char) => shiftChar(char, key)).join('');
};

export const decryptChar = (char: string, key: number) => shiftChar(char, -key);

export const buildInitialTape = (encrypted: string) => {
	const inputCells = Array.from(encrypted);
	const dividerIndex = inputCells.length;
	return {
		machineTape: [...inputCells, DIVIDER_SYMBOL, ...Array(inputCells.length).fill(BLANK_SYMBOL)],
		dividerIndex
	};
};

export const readDecodedFromTape = (machineTape: string[], dividerIndex: number) =>
	machineTape
		.slice(dividerIndex + 1)
		.join('')
		.replace(/_+$/g, '');

export const createMachineRuntime = (encrypted: string, original: string, key: number): MachineRuntime => {
	const { machineTape, dividerIndex } = buildInitialTape(encrypted);

	return {
		currentState: 'qRead',
		headIndex: 0,
		readSymbol: '-',
		writtenSymbol: '-',
		stepCount: 0,
		machineTape,
		dividerIndex,
		inputCursor: 0,
		halted: false,
		pendingDecoded: '',
		machineKey: key,
		machineOriginalText: original,
		machineEncryptedText: encrypted,
		finalMessage: ''
	};
};

const completeMachine = (runtime: MachineRuntime, message: string, traceLines: string[]): StepResult => {
	const finalMessage = readDecodedFromTape(runtime.machineTape, runtime.dividerIndex);
	const matches = finalMessage === runtime.machineOriginalText;

	return {
		runtime: {
			...runtime,
			currentState: 'qH',
			halted: true,
			finalMessage
		},
		traceLines: [
			...traceLines,
			matches
				? 'Verificacion: el resultado final coincide con el mensaje original.'
				: 'Verificacion: el resultado final NO coincide con el mensaje original.'
		],
		completion: {
			message: matches
				? `${message} Mensaje final coincide con el original.`
				: `${message} Mensaje final no coincide.`,
			isMatch: matches
		}
	};
};

const handleReadState = (runtime: MachineRuntime): StepResult => {
	const readSymbol = runtime.machineTape[runtime.headIndex] ?? BLANK_SYMBOL;
	const nextRuntime = {
		...runtime,
		readSymbol,
		writtenSymbol: '-'
	};

	if (readSymbol === DIVIDER_SYMBOL || runtime.inputCursor >= runtime.dividerIndex) {
		return completeMachine(nextRuntime, 'Traduccion terminada.', []);
	}

	const stepCount = runtime.stepCount + 1;
	return {
		runtime: {
			...nextRuntime,
			currentState: 'qDecode',
			stepCount
		},
		traceLines: [`Paso ${stepCount}: lee '${readSymbol}' en la posicion ${runtime.headIndex}.`]
	};
};

const handleDecodeState = (runtime: MachineRuntime): StepResult => {
	const pendingDecoded = decryptChar(runtime.readSymbol, runtime.machineKey);
	const stepCount = runtime.stepCount + 1;

	return {
		runtime: {
			...runtime,
			pendingDecoded,
			currentState: 'qSeekDivider',
			stepCount
		},
		traceLines: [`Paso ${stepCount}: transforma '${runtime.readSymbol}' y obtiene '${pendingDecoded}'.`]
	};
};

const handleSeekDividerState = (runtime: MachineRuntime): StepResult => {
	if (runtime.machineTape[runtime.headIndex] === DIVIDER_SYMBOL) {
		const stepCount = runtime.stepCount + 1;
		return {
			runtime: {
				...runtime,
				currentState: 'qSeekOutput',
				stepCount
			},
			traceLines: [`Paso ${stepCount}: encontro el separador '${DIVIDER_SYMBOL}'.`]
		};
	}

	const headIndex = runtime.headIndex + 1;
	const stepCount = runtime.stepCount + 1;
	return {
		runtime: {
			...runtime,
			headIndex,
			stepCount
		},
		traceLines: [`Paso ${stepCount}: avanza a la derecha hasta el separador (posicion ${headIndex}).`]
	};
};

const handleSeekOutputState = (runtime: MachineRuntime): StepResult => {
	if (runtime.machineTape[runtime.headIndex] === BLANK_SYMBOL) {
		const stepCount = runtime.stepCount + 1;
		return {
			runtime: {
				...runtime,
				currentState: 'qWrite',
				stepCount
			},
			traceLines: [`Paso ${stepCount}: encontro un espacio libre para escribir.`]
		};
	}

	const headIndex = runtime.headIndex + 1;
	const machineTape =
		headIndex >= runtime.machineTape.length
			? [...runtime.machineTape, BLANK_SYMBOL]
			: [...runtime.machineTape];
	const stepCount = runtime.stepCount + 1;

	return {
		runtime: {
			...runtime,
			headIndex,
			machineTape,
			stepCount
		},
		traceLines: [`Paso ${stepCount}: sigue a la derecha buscando espacio de salida (posicion ${headIndex}).`]
	};
};

const handleWriteState = (runtime: MachineRuntime): StepResult => {
	const machineTape = [...runtime.machineTape];
	machineTape[runtime.headIndex] = runtime.pendingDecoded;
	const finalMessage = readDecodedFromTape(machineTape, runtime.dividerIndex);
	const stepCount = runtime.stepCount + 1;

	return {
		runtime: {
			...runtime,
			machineTape,
			writtenSymbol: runtime.pendingDecoded,
			finalMessage,
			currentState: 'qReturn',
			stepCount
		},
		traceLines: [`Paso ${stepCount}: escribe '${runtime.pendingDecoded}' en la zona de salida.`]
	};
};

const handleReturnState = (runtime: MachineRuntime): StepResult => {
	const nextInputIndex = runtime.inputCursor + 1;

	if (runtime.headIndex > nextInputIndex) {
		const headIndex = runtime.headIndex - 1;
		const stepCount = runtime.stepCount + 1;
		return {
			runtime: {
				...runtime,
				headIndex,
				stepCount
			},
			traceLines: [`Paso ${stepCount}: regresa a la izquierda (posicion ${headIndex}).`]
		};
	}

	const stepCount = runtime.stepCount + 1;
	return {
		runtime: {
			...runtime,
			currentState: 'qMove',
			stepCount
		},
		traceLines: [`Paso ${stepCount}: llego al punto de entrada para continuar.`]
	};
};

const handleMoveState = (runtime: MachineRuntime): StepResult => {
	const inputCursor = runtime.inputCursor + 1;
	const headIndex = inputCursor;
	const currentState = inputCursor >= runtime.dividerIndex ? 'qH' : 'qRead';
	const stepCount = runtime.stepCount + 1;
	const nextRuntime: MachineRuntime = {
		...runtime,
		inputCursor,
		headIndex,
		readSymbol: '-',
		writtenSymbol: '-',
		currentState,
		stepCount
	};
	const traceLines = [`Paso ${stepCount}: pasa al siguiente simbolo de entrada (posicion ${headIndex}).`];

	if (currentState === 'qH') {
		return completeMachine(nextRuntime, 'Traduccion terminada.', traceLines);
	}

	return {
		runtime: nextRuntime,
		traceLines
	};
};

const machineStateHandlers: Record<Exclude<MachineState, 'qH'>, (runtime: MachineRuntime) => StepResult> = {
	qRead: handleReadState,
	qDecode: handleDecodeState,
	qSeekDivider: handleSeekDividerState,
	qSeekOutput: handleSeekOutputState,
	qWrite: handleWriteState,
	qReturn: handleReturnState,
	qMove: handleMoveState
};

export const stepMachineRuntime = (runtime: MachineRuntime): StepResult => {
	if (runtime.halted || runtime.machineTape.length === 0 || runtime.currentState === 'qH') {
		return {
			runtime,
			traceLines: []
		};
	}

	return machineStateHandlers[runtime.currentState](runtime);
};