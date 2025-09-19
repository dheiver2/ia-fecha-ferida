# 🌐 Configuração de Rede para Teleconsulta

## Problema Resolvido
O link da teleconsulta agora funciona para outras pessoas na mesma rede local!

## Como Funciona

### Antes (❌ Não funcionava)
- Links gerados com `localhost:8080`
- Só funcionava no seu computador
- Outras pessoas não conseguiam acessar

### Agora (✅ Funciona)
- Links gerados com IP da rede local (ex: `192.168.15.31:8080`)
- Funciona para qualquer pessoa na mesma rede WiFi
- Configuração automática via arquivo `.env`

## Configuração

### 1. IP da Rede Já Configurado
O IP `192.168.15.31` já está configurado no arquivo `frontend/.env`:

```env
VITE_NETWORK_IP=192.168.15.31
```

### 2. Como Descobrir Seu IP (se necessário)
Se você mudar de rede, execute no terminal:

**Windows:**
```cmd
ipconfig
```

**Linux/Mac:**
```bash
ifconfig
```

Procure pelo IP que começa com:
- `192.168.x.x`
- `10.x.x.x`
- `172.16.x.x` até `172.31.x.x`

### 3. Atualizar IP (se necessário)
Edite o arquivo `frontend/.env` e altere:
```env
VITE_NETWORK_IP=SEU_NOVO_IP
```

## Testando

1. **Gere um link de teleconsulta**
2. **Verifique no console do navegador** - deve aparecer:
   ```
   🌐 Usando IP da rede configurado: 192.168.15.31:8080
   ```
3. **Compartilhe o link** com alguém na mesma rede WiFi
4. **A pessoa deve conseguir acessar** normalmente

## Troubleshooting

### Link ainda não funciona?
1. Verifique se ambos estão na mesma rede WiFi
2. Confirme o IP no arquivo `.env`
3. Reinicie o servidor frontend (`npm run dev`)
4. Verifique se não há firewall bloqueando a porta 8080

### Console mostra aviso?
Se aparecer:
```
⚠️ IP da rede não configurado
```

Significa que o arquivo `.env` não foi carregado corretamente. Reinicie o servidor.

## Ambientes

- **Desenvolvimento**: Usa IP da rede local configurado
- **Produção**: Usa domínio real automaticamente
- **Fallback**: Volta para localhost se não configurado