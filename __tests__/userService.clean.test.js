const { UserService } = require("../src/userService");

describe("UserService - Suíte de Testes Limpa (Clean)", () => {
  let userService;

  beforeEach(() => {
    userService = new UserService();
    userService._clearDB();
  });

  it("deve criar um novo usuário com sucesso", () => {
    const dadosUsuario = {
      nome: "Usuário Limpo",
      email: "limpo@teste.com",
      idade: 30,
    };

    const usuarioCriado = userService.createUser(
      dadosUsuario.nome,
      dadosUsuario.email,
      dadosUsuario.idade
    );

    expect(usuarioCriado.id).toBeDefined();
    expect(usuarioCriado.nome).toBe("Usuário Limpo");
    expect(usuarioCriado.status).toBe("ativo");
    expect(usuarioCriado.isAdmin).toBe(false);
  });

  it("deve buscar um usuário existente pelo ID", () => {
    const dadosUsuario = {
      nome: "Usuário Para Busca",
      email: "busca@teste.com",
      idade: 40,
    };
    const usuarioCriado = userService.createUser(
      dadosUsuario.nome,
      dadosUsuario.email,
      dadosUsuario.idade
    );

    const usuarioBuscado = userService.getUserById(usuarioCriado.id);

    expect(usuarioBuscado).toEqual(usuarioCriado);
  });

  it("deve desativar um usuário comum com sucesso", () => {
    const usuarioComum = userService.createUser(
      "Comum",
      "comum@teste.com",
      30,
      false
    );

    // ACT
    const resultado = userService.deactivateUser(usuarioComum.id);

    expect(resultado).toBe(true);
    const usuarioAtualizado = userService.getUserById(usuarioComum.id);
    expect(usuarioAtualizado.status).toBe("inativo");
  });

  it("não deve desativar um usuário administrador", () => {
    const usuarioAdmin = userService.createUser(
      "Admin",
      "admin@teste.com",
      40,
      true
    );

    const resultado = userService.deactivateUser(usuarioAdmin.id);

    expect(resultado).toBe(false);
    const usuarioAtualizado = userService.getUserById(usuarioAdmin.id);
    expect(usuarioAtualizado.status).toBe("ativo");
  });

  it("deve gerar um relatório contendo os usuários cadastrados", () => {
    const usuario1 = userService.createUser("Alice", "alice@email.com", 28);
    const usuario2 = userService.createUser("Bob", "bob@email.com", 32);

    const relatorio = userService.generateUserReport();

    expect(relatorio).toContain("--- Relatório de Usuários ---");
    expect(relatorio).toContain(usuario1.id);
    expect(relatorio).toContain("Alice");
    expect(relatorio).toContain(usuario2.id);
    expect(relatorio).toContain("Bob");
  });

  it("deve lançar um erro ao tentar criar usuário menor de idade", () => {
    const acao = () => {
      userService.createUser("Menor", "menor@email.com", 17);
    };

    expect(acao).toThrow("O usuário deve ser maior de idade.");
  });

  it("deve lançar um erro ao tentar criar usuário sem campos obrigatórios", () => {
    const acao = () => {
      userService.createUser("Sem Email", null, 30);
    };

    expect(acao).toThrow("Nome, email e idade são obrigatórios.");
  });

  it('deve gerar um relatório de "Nenhum usuário" quando o banco está vazio', () => {
    const relatorio = userService.generateUserReport();

    expect(relatorio).toContain("Nenhum usuário cadastrado.");
  });
});
