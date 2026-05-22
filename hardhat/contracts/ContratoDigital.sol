// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title ContratoDigital
 * @dev Contrato para assinatura digital entre duas partes
 */
contract ContratoDigital {

    enum Status { Pendente, AssinadoParte1, AssinadoPorAmbos, Cancelado }

    struct Contrato {
        uint256 id;
        string  descricao;
        address parte1;
        address parte2;
        bool    assinadoParte1;
        bool    assinadoParte2;
        Status  status;
        uint256 criadoEm;
        uint256 assinadoEm;
    }

    uint256 public totalContratos;
    mapping(uint256 => Contrato) public contratos;

    event ContratoCriado(uint256 indexed id, address parte1, address parte2, string descricao);
    event ContratoAssinado(uint256 indexed id, address assinante, Status status);
    event ContratoCancelado(uint256 indexed id, address canceladoPor);

    modifier apenasPartes(uint256 _id) {
        require(
            msg.sender == contratos[_id].parte1 || msg.sender == contratos[_id].parte2,
            "Apenas as partes podem interagir"
        );
        _;
    }

    modifier contratoAtivo(uint256 _id) {
        require(
            contratos[_id].status != Status.Cancelado &&
            contratos[_id].status != Status.AssinadoPorAmbos,
            "Contrato nao esta mais ativo"
        );
        _;
    }

    function criarContrato(
        address _parte2,
        string memory _descricao
    ) external returns (uint256) {
        require(_parte2 != address(0), "Endereco invalido");
        require(_parte2 != msg.sender, "As partes devem ser diferentes");
        require(bytes(_descricao).length > 0, "Descricao obrigatoria");

        uint256 id = totalContratos++;

        contratos[id] = Contrato({
            id:             id,
            descricao:      _descricao,
            parte1:         msg.sender,
            parte2:         _parte2,
            assinadoParte1: false,
            assinadoParte2: false,
            status:         Status.Pendente,
            criadoEm:       block.timestamp,
            assinadoEm:     0
        });

        emit ContratoCriado(id, msg.sender, _parte2, _descricao);
        return id;
    }

    function assinarContrato(uint256 _id)
        external
        apenasPartes(_id)
        contratoAtivo(_id)
    {
        Contrato storage c = contratos[_id];

        if (msg.sender == c.parte1) {
            require(!c.assinadoParte1, "Parte 1 ja assinou");
            c.assinadoParte1 = true;
            c.status = Status.AssinadoParte1;
        } else {
            require(!c.assinadoParte2, "Parte 2 ja assinou");
            c.assinadoParte2 = true;
        }

        if (c.assinadoParte1 && c.assinadoParte2) {
            c.status     = Status.AssinadoPorAmbos;
            c.assinadoEm = block.timestamp;
        }

        emit ContratoAssinado(_id, msg.sender, c.status);
    }

    function cancelarContrato(uint256 _id)
        external
        apenasPartes(_id)
        contratoAtivo(_id)
    {
        contratos[_id].status = Status.Cancelado;
        emit ContratoCancelado(_id, msg.sender);
    }

    function verContrato(uint256 _id) external view returns (
        uint256 id,
        string memory descricao,
        address parte1,
        address parte2,
        bool assinadoParte1,
        bool assinadoParte2,
        uint8 status,
        uint256 criadoEm,
        uint256 assinadoEm
    ) {
        Contrato storage c = contratos[_id];
        return (c.id, c.descricao, c.parte1, c.parte2, c.assinadoParte1, c.assinadoParte2, uint8(c.status), c.criadoEm, c.assinadoEm);
    }
}