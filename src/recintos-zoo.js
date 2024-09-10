// Definindo a classe RecintosZoo, responsável por analisar recintos disponíveis para os animais
class RecintosZoo {
    constructor() {
        // Definindo os recintos existentes no zoológico
        this.recintos = [
            { numero: 1, bioma: 'savana', espacoTotal: 10, animais: [{ especie: 'MACACO', quantidade: 3, tipo: 'onívoro' }] },
            { numero: 2, bioma: 'floresta', espacoTotal: 5, animais: [] }, // Recinto vazio
            { numero: 3, bioma: 'savana e rio', espacoTotal: 7, animais: [{ especie: 'GAZELA', quantidade: 1, tipo: 'herbivoro' }] },
            { numero: 4, bioma: 'rio', espacoTotal: 8, animais: [] }, // Recinto vazio
            { numero: 5, bioma: 'savana', espacoTotal: 9, animais: [{ especie: 'LEAO', quantidade: 1, tipo: 'carnivoro' }] }
        ];

        // Tabela de espécies com seus respectivos tamanhos e biomas compatíveis
        this.animais = {
            'LEAO': { tamanho: 3, biomas: ['savana'], tipo: 'carnivoro' },
            'LEOPARDO': { tamanho: 2, biomas: ['savana'], tipo: 'carnivoro' },
            'CROCODILO': { tamanho: 3, biomas: ['rio'], tipo: 'carnivoro' },
            'MACACO': { tamanho: 1, biomas: ['savana', 'floresta'], tipo: 'onívoro' },
            'GAZELA': { tamanho: 2, biomas: ['savana'], tipo: 'herbivoro' },
            'HIPOPOTAMO': { tamanho: 4, biomas: ['savana e rio', 'rio'], tipo: 'herbivoro' }
        };
    }

    // Método responsável por analisar quais recintos são viáveis para um determinado animal e quantidade
    analisaRecintos(animal, quantidade) {
        // Converte o nome do animal para maiúsculas
        animal = animal.toUpperCase();

        // Verifica se o animal informado é válido
        if (!this.animais[animal]) {
            return { erro: "Animal inválido" };
        }

        // Verifica se a quantidade de animais é válida (precisa ser maior que 0)
        if (quantidade <= 0) {
            return { erro: "Quantidade inválida" };
        }

        const dadosAnimal = this.animais[animal];
        const recintosViaveis = [];

        // Itera sobre os recintos para encontrar os viáveis
        for (let recinto of this.recintos) {
            let espacoOcupado = 0;
            let misturaEspecies = recinto.animais.length > 0 && !recinto.animais.every(a => a.especie === animal);
            let recintoComCarnivoro = recinto.animais.some(a => this.animais[a.especie].tipo === 'carnivoro');

            // Regra: Herbívoros ou onívoros não podem conviver com carnívoros
            if (dadosAnimal.tipo !== 'carnivoro' && recintoComCarnivoro) {
                continue;  // Ignora recintos com carnívoros se o animal for herbívoro ou onívoro
            }

            // Calcula o espaço ocupado pelos animais já presentes no recinto
            for (let a of recinto.animais) {
                espacoOcupado += this.animais[a.especie].tamanho * a.quantidade;
            }

            // Aplica regra de mistura de espécies, adicionando 1 unidade de espaço extra
            if (misturaEspecies) {
                espacoOcupado += 1;  // Mistura de espécies requer espaço adicional
            }

            // Verifica se há espaço suficiente no recinto após adicionar os novos animais
            let espacoLivre = recinto.espacoTotal - espacoOcupado - (dadosAnimal.tamanho * quantidade);

            // macacos podem entrar em recintos vazios se já houver outro animal não carnivoro OU se for entrar pelo menos 2 macacos 
            if (animal === 'MACACO' && recinto.animais.length === 0 && quantidade < 2) {
                return;  // Se houver menos de 2 macacos, não pode entrar em recintos vazios
            }

            // Verifica se o bioma do recinto é compatível com o animal e se há espaço suficiente
            if (dadosAnimal.biomas.includes(recinto.bioma) && espacoLivre >= 0) {
                recintosViaveis.push(`Recinto ${recinto.numero} (espaço livre: ${espacoLivre} total: ${recinto.espacoTotal})`);
            }
        }

        // Retorna erro caso não haja recintos viáveis
        if (recintosViaveis.length === 0) {
            return { erro: "Não há recinto viável" };
        }

        // Retorna a lista de recintos viáveis
        return { recintosViaveis };
    }
}

// Exporta a classe conforme especificado para manter compatibilidade com os testes
export { RecintosZoo as RecintosZoo };
