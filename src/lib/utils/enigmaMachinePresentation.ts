import {
	ALPHABET,
	BLANK_SYMBOL,
	DIVIDER_SYMBOL,
	STATE_LABELS,
	decryptChar,
	type MachineRuntime,
	type MachineState
} from '$lib/utils/enigmaMachine';

export type EncryptionProcessView = {
	codeExplanation: string;
	encryptionSummary: string;
	encryptionDetailIntro: string;
	encryptionDetailSteps: string[];
};

export const DEFAULT_CODE_EXPLANATION =
	'El codigo se obtiene contando los dias UTC transcurridos desde la fecha elegida y reduciendo ese valor a un numero del alfabeto.';

export const DEFAULT_ENCRYPTION_PROCESS: EncryptionProcessView = {
	codeExplanation: DEFAULT_CODE_EXPLANATION,
	encryptionSummary: 'Todavia no se ha generado el recorrido del cifrado.',
	encryptionDetailIntro: '',
	encryptionDetailSteps: []
};

export const renderEncryptionProcess = (key: number | null): Omit<EncryptionProcessView, 'codeExplanation'> => {
	if (key === null || Number.isNaN(key)) {
		return {
			encryptionSummary: DEFAULT_ENCRYPTION_PROCESS.encryptionSummary,
			encryptionDetailIntro: '',
			encryptionDetailSteps: []
		};
	}

	return {
		encryptionSummary: `El codigo ${key} sale del conteo de dias y define un desplazamiento uniforme para todos los simbolos validos del mensaje.`,
		encryptionDetailIntro: `Primero se cuentan los dias UTC transcurridos desde la fecha elegida. Luego ese total se reduce a un numero valido del alfabeto, y la maquina usa ese resultado para mover ${key} posiciones cada simbolo del mensaje.`,
		encryptionDetailSteps: [
			`Se toma el numero total de dias transcurridos y se convierte en el codigo ${key}.`,
			`Si el simbolo forma parte del alfabeto, se sustituye por otro simbolo desplazado ${key} posiciones.`,
			'Si el desplazamiento supera el final del alfabeto, el proceso vuelve al inicio y continua desde ahi.',
			'Todos los caracteres del mensaje se transforman con la misma regla, por eso el cifrado es consistente.',
			'Durante el descifrado, la maquina aplica el movimiento inverso para recuperar exactamente el mensaje original.'
		]
	};
};

export const renderCodeExplanation = (referenceDateStr: string, dailyNumber: number, code: number) =>
	`Dias UTC transcurridos desde ${referenceDateStr}: ${dailyNumber}. Formula usada: (dias mod ${ALPHABET.length - 1}) + 1. Resultado: codigo ${code}, que desplaza ${code} posiciones cada simbolo del alfabeto.`;

type DidacticCopyInput = {
	machineTape: string[];
	headIndex: number;
	halted: boolean;
	currentState: MachineState;
	pendingDecoded: string;
	machineKey: number;
};

export const getDidacticRule = ({
	machineTape,
	headIndex,
	halted,
	currentState,
	pendingDecoded,
	machineKey
}: DidacticCopyInput) => {
	if (machineTape.length === 0) {
		return 'Regla activa: si la cinta esta vacia, primero debes cargar un mensaje encriptado.';
	}

	if (halted || currentState === 'qH') {
		return 'Regla activa: si el estado es Fin, la maquina se detiene y valida el resultado.';
	}

	const currentSymbol = machineTape[headIndex] ?? BLANK_SYMBOL;

	if (currentState === 'qRead') {
		return `Regla activa: lee el simbolo actual (${currentSymbol}) de la zona de entrada.`;
	}

	if (currentState === 'qDecode') {
		return `Regla activa: transforma ${currentSymbol} con el codigo para obtener ${decryptChar(currentSymbol, machineKey)}.`;
	}

	if (currentState === 'qSeekDivider') {
		return `Regla activa: mueve el cabezal a la derecha hasta encontrar el separador ${DIVIDER_SYMBOL}.`;
	}

	if (currentState === 'qSeekOutput') {
		return `Regla activa: sigue a la derecha hasta hallar un espacio libre (${BLANK_SYMBOL}) en la salida.`;
	}

	if (currentState === 'qWrite') {
		const outputSymbol = pendingDecoded || decryptChar(currentSymbol, machineKey);
		return `Regla activa: escribe ${outputSymbol} en la zona de salida.`;
	}

	if (currentState === 'qReturn') {
		return 'Regla activa: vuelve hacia la izquierda para continuar con el siguiente simbolo de entrada.';
	}

	return 'Regla activa: avanza al siguiente simbolo de entrada.';
};

export const getDidacticAction = ({ machineTape, halted, currentState }: DidacticCopyInput) => {
	if (machineTape.length === 0) {
		return 'Siguiente accion sugerida: genera el cifrado y carga la maquina.';
	}

	if (halted || currentState === 'qH') {
		return 'Siguiente accion sugerida: revisa la traza y usa Reiniciar para repetir el proceso.';
	}

	if (currentState === 'qRead') {
		return 'Siguiente accion sugerida: la maquina va a leer el simbolo actual de la cinta encriptada.';
	}

	if (currentState === 'qDecode') {
		return 'Siguiente accion sugerida: la maquina aplicara el codigo para obtener el simbolo descifrado.';
	}

	if (currentState === 'qWrite') {
		return 'Siguiente accion sugerida: la maquina escribira el simbolo descifrado en la salida.';
	}

	if (currentState === 'qSeekDivider' || currentState === 'qSeekOutput') {
		return 'Siguiente accion sugerida: la maquina seguira avanzando a la derecha.';
	}

	if (currentState === 'qReturn') {
		return 'Siguiente accion sugerida: la maquina regresara a la izquierda para seguir con la entrada.';
	}

	return 'Siguiente accion sugerida: la maquina pasara al siguiente simbolo de entrada.';
};

export const getStateLabel = (state: MachineState) => STATE_LABELS[state];