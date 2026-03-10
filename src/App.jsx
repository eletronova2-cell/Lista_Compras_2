import { useState, useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from "recharts";

const CATEGORIAS = {
  higiene:     { label: "Higiene & Beleza",   emoji: "🧴", cor: "#8B5CF6" },
  limpeza:     { label: "Limpeza",             emoji: "🧹", cor: "#3B82F6" },
  alimentacao: { label: "Alimentação",         emoji: "🥫", cor: "#F59E0B" },
  carnes:      { label: "Carnes & Peixes",     emoji: "🥩", cor: "#EF4444" },
  frutas:      { label: "Frutas & Verduras",   emoji: "🥦", cor: "#10B981" },
  lanches:     { label: "Lanches & Bebidas",   emoji: "🧃", cor: "#EC4899" },
};

const LISTA_INICIAL = [
  // ── Higiene & Beleza ────────────────────────────────────────────────────────
  { nome:"Sabonete",          marca:"Palmolive",     modelo:"Framboesa e Amora",          unidade:"g",   quantidade:6,  preco:4.20,  categoria:"higiene"     },
  { nome:"Creme Dental",      marca:"Colgate",       modelo:"Carvão Ativado",             unidade:"g",   quantidade:1,  preco:12.00, categoria:"higiene"     },
  { nome:"Aparelho de Barbear",marca:"Gilete",       modelo:"Prestobarba 3",              unidade:"cx",  quantidade:1,  preco:20.00, categoria:"higiene"     },
  { nome:"Desodorante Masculino",marca:"Old Spice",  modelo:"Amadeirado",                 unidade:"ml",  quantidade:2,  preco:14.00, categoria:"higiene"     },
  { nome:"Papel Toalha",      marca:"Yuri",          modelo:"Folha Dupla",                unidade:"rolo",quantidade:2,  preco:5.80,  categoria:"higiene"     },
  { nome:"Papel Higiênico",   marca:"Dueto",         modelo:"Folha Dupla",                unidade:"un",  quantidade:1,  preco:18.00, categoria:"higiene"     },
  { nome:"Desodorante Feminino",marca:"Suave",       modelo:"Frutas Vermelhas",           unidade:"ml",  quantidade:1,  preco:14.00, categoria:"higiene"     },
  { nome:"Shampoo Feminino",  marca:"Dove",          modelo:"Kit Shampoo + Condicionador",unidade:"ml",  quantidade:1,  preco:45.00, categoria:"higiene"     },
  { nome:"Shampoo Masculino", marca:"Seda",          modelo:"Kit Shampoo + Condicionador",unidade:"ml",  quantidade:1,  preco:15.00, categoria:"higiene"     },
  { nome:"Enxaguante Bucal",  marca:"Listerine",     modelo:"Hortelã",                    unidade:"ml",  quantidade:1,  preco:29.90, categoria:"higiene"     },
  { nome:"Filtro de Café",    marca:"Mellita",       modelo:"102",                        unidade:"un",  quantidade:1,  preco:5.00,  categoria:"higiene"     },
  { nome:"Creme Hidratante",  marca:"Paixão",        modelo:"Amêndoas",                   unidade:"ml",  quantidade:0,  preco:12.00, categoria:"higiene"     },
  { nome:"Desodorante Feminino",marca:"Suave",       modelo:"Invisible",                  unidade:"ml",  quantidade:1,  preco:14.00, categoria:"higiene"     },
  // ── Limpeza ─────────────────────────────────────────────────────────────────
  { nome:"Limpador Perfumado",marca:"Veja",          modelo:"Serras Brasileiras",         unidade:"Lt",  quantidade:0,  preco:14.00, categoria:"limpeza"     },
  { nome:"Esponja de Lavar Louça",marca:"Esfrebom",  modelo:"Multiuso",                   unidade:"un",  quantidade:0,  preco:4.00,  categoria:"limpeza"     },
  { nome:"Detergente Louça",  marca:"Ypê",           modelo:"Fragâncias",                 unidade:"ml",  quantidade:6,  preco:2.60,  categoria:"limpeza"     },
  { nome:"Sabão Líquido",     marca:"Tixan",         modelo:"Primavera",                  unidade:"Lt",  quantidade:1,  preco:30.00, categoria:"limpeza"     },
  { nome:"Amaciante",         marca:"Downy",         modelo:"Brisa Intenso",              unidade:"ml",  quantidade:2,  preco:21.00, categoria:"limpeza"     },
  { nome:"Cloro",             marca:"Candura",       modelo:"Candura",                    unidade:"Lt",  quantidade:1,  preco:13.50, categoria:"limpeza"     },
  { nome:"Refil Inseticida",  marca:"SBP",           modelo:"Cheiro Suave - Kit c/3",     unidade:"ml",  quantidade:1,  preco:25.00, categoria:"limpeza"     },
  // ── Alimentação ─────────────────────────────────────────────────────────────
  { nome:"Leite",             marca:"Italac",        modelo:"Zero Lactose",               unidade:"Lt",  quantidade:12, preco:4.50,  categoria:"alimentacao" },
  { nome:"Molho de Tomate",   marca:"Tomodoro",      modelo:"Tradicional",                unidade:"g",   quantidade:12, preco:1.10,  categoria:"alimentacao" },
  { nome:"Açúcar",            marca:"União",         modelo:"Refinado",                   unidade:"kg",  quantidade:8,  preco:3.50,  categoria:"alimentacao" },
  { nome:"Tempero",           marca:"Sazon",         modelo:"Sabores",                    unidade:"gr",  quantidade:6,  preco:5.00,  categoria:"alimentacao" },
  { nome:"Feijão",            marca:"Nenê",          modelo:"Carioca",                    unidade:"kg",  quantidade:2,  preco:6.50,  categoria:"alimentacao" },
  { nome:"Sardinha",          marca:"Gomes da Costa",modelo:"Óleo",                       unidade:"gr",  quantidade:4,  preco:5.60,  categoria:"alimentacao" },
  { nome:"Ovo",               marca:"Ovo",           modelo:"C/ 60 unidades",             unidade:"cx",  quantidade:2,  preco:17.00, categoria:"alimentacao" },
  { nome:"Leite Condensado",  marca:"Italac",        modelo:"Integral",                   unidade:"g",   quantidade:4,  preco:4.60,  categoria:"alimentacao" },
  { nome:"Arroz",             marca:"Raroz",         modelo:"Tipo 1",                     unidade:"kg",  quantidade:2,  preco:12.50, categoria:"alimentacao" },
  { nome:"Farinha de Trigo",  marca:"Dona Benta",    modelo:"Tradicional",                unidade:"kg",  quantidade:1,  preco:5.00,  categoria:"alimentacao" },
  { nome:"Café",              marca:"Pilão",         modelo:"Tradicional",                unidade:"g",   quantidade:0,  preco:35.00, categoria:"alimentacao" },
  { nome:"Amido de Milho",    marca:"Maizena",       modelo:"Maizena",                    unidade:"g",   quantidade:0,  preco:7.00,  categoria:"alimentacao" },
  { nome:"Gelatina",          marca:"Dr. Oetker",    modelo:"Sabores",                    unidade:"g",   quantidade:0,  preco:2.00,  categoria:"alimentacao" },
  { nome:"Achocolatado",      marca:"Toddy",         modelo:"Original",                   unidade:"kg",  quantidade:1,  preco:17.90, categoria:"alimentacao" },
  { nome:"Iogurte",           marca:"Danone",        modelo:"Sabores",                    unidade:"lt",  quantidade:3,  preco:12.00, categoria:"alimentacao" },
  { nome:"Farofa Mandioca",   marca:"Yoki",          modelo:"Temperada",                  unidade:"g",   quantidade:1,  preco:6.50,  categoria:"alimentacao" },
  { nome:"Sal",               marca:"Lebre",         modelo:"Refinado",                   unidade:"kg",  quantidade:1,  preco:3.00,  categoria:"alimentacao" },
  // ── Lanches & Bebidas ───────────────────────────────────────────────────────
  { nome:"Chá Matte",         marca:"Matte",         modelo:"Tradicional",                unidade:"gr",  quantidade:1,  preco:14.00, categoria:"lanches"     },
  // ── Carnes & Peixes ─────────────────────────────────────────────────────────
  { nome:"Filé de Frango",    marca:"",              modelo:"",                           unidade:"kg",  quantidade:3,  preco:60.00, categoria:"carnes"      },
  { nome:"Cordão Mignon",     marca:"",              modelo:"",                           unidade:"kg",  quantidade:1,  preco:27.00, categoria:"carnes"      },
  { nome:"Carne Moída",       marca:"",              modelo:"",                           unidade:"kg",  quantidade:2,  preco:27.00, categoria:"carnes"      },
  { nome:"Coxão Mole",        marca:"",              modelo:"",                           unidade:"kg",  quantidade:2,  preco:35.00, categoria:"carnes"      },
  { nome:"Ponta de Alcatra",  marca:"",              modelo:"",                           unidade:"kg",  quantidade:2,  preco:35.00, categoria:"carnes"      },
  { nome:"Costela de Porco",  marca:"",              modelo:"",                           unidade:"kg",  quantidade:2,  preco:17.00, categoria:"carnes"      },
  { nome:"Peixe Tilápia",     marca:"",              modelo:"",                           unidade:"kg",  quantidade:2,  preco:40.00, categoria:"carnes"      },
  { nome:"Batata Frita",      marca:"",              modelo:"",                           unidade:"kg",  quantidade:1,  preco:26.00, categoria:"carnes"      },
  // ── Frutas & Verduras ────────────────────────────────────────────────────────
  { nome:"Limão",             marca:"",              modelo:"",                           unidade:"un",  quantidade:1,  preco:3.90,  categoria:"frutas"      },
  { nome:"Abacate",           marca:"",              modelo:"",                           unidade:"un",  quantidade:1,  preco:5.70,  categoria:"frutas"      },
  { nome:"Maçã",              marca:"",              modelo:"",                           unidade:"un",  quantidade:1,  preco:8.00,  categoria:"frutas"      },
  { nome:"Laranja",           marca:"",              modelo:"",                           unidade:"un",  quantidade:1,  preco:3.90,  categoria:"frutas"      },
  { nome:"Banana",            marca:"",              modelo:"",                           unidade:"un",  quantidade:1,  preco:5.00,  categoria:"frutas"      },
  { nome:"Repolho",           marca:"",              modelo:"",                           unidade:"un",  quantidade:1,  preco:5.00,  categoria:"frutas"      },
  { nome:"Tomate",            marca:"",              modelo:"",                           unidade:"un",  quantidade:3,  preco:7.00,  categoria:"frutas"      },
  { nome:"Batata",            marca:"",              modelo:"",                           unidade:"un",  quantidade:6,  preco:4.00,  categoria:"frutas"      },
  { nome:"Abóbora",           marca:"",              modelo:"",                           unidade:"un",  quantidade:2,  preco:7.00,  categoria:"frutas"      },
  { nome:"Batata Doce",       marca:"",              modelo:"",                           unidade:"un",  quantidade:1,  preco:4.00,  categoria:"frutas"      },
  { nome:"Cebola",            marca:"",              modelo:"",                           unidade:"un",  quantidade:2,  preco:4.00,  categoria:"frutas"      },
  { nome:"Pimentão",          marca:"",              modelo:"",                           unidade:"un",  quantidade:2,  preco:6.00,  categoria:"frutas"      },
  { nome:"Abobrinha",         marca:"",              modelo:"",                           unidade:"un",  quantidade:2,  preco:4.00,  categoria:"frutas"      },
  { nome:"Mandioca",          marca:"",              modelo:"",                           unidade:"un",  quantidade:1,  preco:6.00,  categoria:"frutas"      },
  { nome:"Quiabo",            marca:"",              modelo:"",                           unidade:"un",  quantidade:1,  preco:9.00,  categoria:"frutas"      },
  { nome:"Mexirica",          marca:"",              modelo:"",                           unidade:"un",  quantidade:1,  preco:4.00,  categoria:"frutas"      },
];

const SUGERIDOS = {
  alimentacao: ["Macarrão","Azeite","Óleo de Soja","Vinagre","Shoyu","Alho","Milho em Lata","Ervilha","Atum","Biscoito","Extrato de Tomate","Caldo Knorr"],
  carnes:      ["Frango Inteiro","Coxa e Sobrecoxa","Linguiça","Bacon","Presunto","Camarão","Salsicha","Alcatra","Picanha"],
  frutas:      ["Mamão","Melancia","Uva","Manga","Abacaxi","Morango","Pera","Alface","Pepino","Beterraba","Brócolis","Couve","Espinafre"],
  limpeza:     ["Esponja de Aço","Rodo","Vassoura","Pano de Chão","Saco de Lixo","Desengordurante","Limpador de Banheiro"],
  higiene:     ["Fio Dental","Protetor Solar","Absorvente","Cotonetes","Creme de Barbear","Perfume","Hidratante Facial"],
  lanches:     ["Biscoito Recheado","Granola","Cereal","Chocolate","Pipoca","Suco de Caixinha","Refrigerante","Água Mineral","Mel","Barra de Cereal"],
};

let proximoId = LISTA_INICIAL.length + 1;
const listaComIds = LISTA_INICIAL.map((item, i) => ({ ...item, id: i + 1 }));

// ─── estilos compartilhados ──────────────────────────────────────────────────
const BASE = {
  minHeight: "100vh",
  background: "linear-gradient(160deg,#0f0c29 0%,#1a1a2e 60%,#16213e 100%)",
  fontFamily: "'Plus Jakarta Sans',sans-serif",
  color: "#f0f0f0",
};
const inpStyle = (extra = {}) => ({
  background: "rgba(255,255,255,0.08)",
  border: "1.5px solid rgba(255,255,255,0.15)",
  borderRadius: 11,
  padding: "12px 14px",
  color: "#fff",
  fontSize: 13,
  fontFamily: "'Plus Jakarta Sans',sans-serif",
  outline: "none",
  ...extra,
});

// ─── Modal base ──────────────────────────────────────────────────────────────
function Modal({ children, onClose }) {
  return (
    <div onClick={onClose} style={{ position:"fixed",inset:0,background:"rgba(0,0,0,0.75)",backdropFilter:"blur(8px)",zIndex:300,display:"flex",alignItems:"center",justifyContent:"center",padding:20 }}>
      <div onClick={e=>e.stopPropagation()} style={{ background:"#1a1a2e",border:"1px solid rgba(255,255,255,0.13)",borderRadius:22,padding:28,width:"100%",maxWidth:420,boxShadow:"0 40px 100px rgba(0,0,0,0.8)" }}>
        {children}
      </div>
    </div>
  );
}

// ─── Modal edição de item (lista base) ───────────────────────────────────────
function ModalEdicao({ item, onSalvar, onFechar, onRemover }) {
  const [nome,      setNome]      = useState(item.nome);
  const [marca,     setMarca]     = useState(item.marca     || "");
  const [modelo,    setModelo]    = useState(item.modelo    || "");
  const [detalhe,   setDetalhe]   = useState(item.detalhe   || "");
  const [qtd,       setQtd]       = useState(String(item.quantidade));
  const [unidade,   setUnidade]   = useState(item.unidade);
  const [preco,     setPreco]     = useState(item.preco > 0 ? String(item.preco) : "");
  const [categoria, setCategoria] = useState(item.categoria);
  const cat = CATEGORIAS[categoria];
  const inp = inpStyle({ width:"100%", boxSizing:"border-box" });
  const lbl = { fontSize:11, color:"rgba(255,255,255,0.4)", fontWeight:700, textTransform:"uppercase", letterSpacing:.8 };
  const sec = { fontSize:10, fontWeight:800, color:"rgba(255,255,255,0.22)", textTransform:"uppercase", letterSpacing:1, marginBottom:10, borderBottom:"1px solid rgba(255,255,255,0.07)", paddingBottom:6, marginTop:4 };

  return (
    <Modal onClose={onFechar}>
      <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18 }}>
        <span style={{ fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:800,fontSize:18 }}>✏️ Editar item</span>
        <button onClick={onFechar} style={{ background:"rgba(255,255,255,0.08)",border:"none",color:"rgba(255,255,255,0.5)",width:30,height:30,borderRadius:8,cursor:"pointer",fontSize:16 }}>✕</button>
      </div>

      <div style={{ maxHeight:"66vh", overflowY:"auto", paddingRight:2 }}>

        <div style={sec}>Identificação do produto</div>

        <label style={lbl}>Nome do produto</label>
        <input type="text" value={nome} onChange={e=>setNome(e.target.value)} placeholder="ex: Creme Dental" style={{ ...inp, marginTop:6, marginBottom:10 }} />

        <div style={{ display:"flex", gap:10, marginBottom:10 }}>
          <div style={{ flex:1 }}>
            <label style={lbl}>Marca</label>
            <input type="text" value={marca} onChange={e=>setMarca(e.target.value)} placeholder="ex: Colgate" style={{ ...inp, marginTop:6 }} />
          </div>
          <div style={{ flex:1 }}>
            <label style={lbl}>Modelo / Linha</label>
            <input type="text" value={modelo} onChange={e=>setModelo(e.target.value)} placeholder="ex: Tripla Ação" style={{ ...inp, marginTop:6 }} />
          </div>
        </div>

        <label style={lbl}>Detalhe adicional</label>
        <input type="text" value={detalhe} onChange={e=>setDetalhe(e.target.value)} placeholder="ex: 180g, caixa c/12, zero açúcar…" style={{ ...inp, marginTop:6, marginBottom:16 }} />

        <div style={sec}>Categoria</div>
        <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:16 }}>
          {Object.entries(CATEGORIAS).map(([k,c])=>(
            <button key={k} onClick={()=>setCategoria(k)} style={{ padding:"6px 11px",borderRadius:999,border:`2px solid ${categoria===k?c.cor:"rgba(255,255,255,0.1)"}`,background:categoria===k?`${c.cor}22`:"transparent",color:categoria===k?c.cor:"rgba(255,255,255,0.4)",fontSize:11,fontWeight:700,cursor:"pointer" }}>
              {c.emoji} {c.label}
            </button>
          ))}
        </div>

        <div style={sec}>Quantidade e preço</div>
        <div style={{ display:"flex", gap:10, marginBottom:10 }}>
          <div style={{ flex:1 }}>
            <label style={lbl}>Quantidade</label>
            <input type="number" value={qtd} onChange={e=>setQtd(e.target.value)} min="0" step="0.5" style={{ ...inp, marginTop:6 }} />
          </div>
          <div style={{ width:110 }}>
            <label style={lbl}>Unidade</label>
            <select value={unidade} onChange={e=>setUnidade(e.target.value)} style={{ ...inpStyle({ width:"100%",boxSizing:"border-box",padding:"12px 10px" }), marginTop:6 }}>
              {["un","kg","g","L","ml","cx","pct","dz"].map(u=><option key={u} value={u} style={{ background:"#1a1a2e" }}>{u}</option>)}
            </select>
          </div>
        </div>

        <label style={lbl}>Preço unitário (R$)</label>
        <input type="number" value={preco} onChange={e=>setPreco(e.target.value)} min="0" step="0.01" placeholder="0,00" style={{ ...inp, marginTop:6, marginBottom:4 }} />
      </div>

      <div style={{ display:"flex", gap:8, marginTop:18 }}>
        <button onClick={onRemover} style={{ background:"rgba(239,68,68,0.12)",border:"1px solid rgba(239,68,68,0.25)",borderRadius:12,padding:"13px 16px",color:"#f87171",fontWeight:700,fontSize:13,cursor:"pointer",fontFamily:"'Plus Jakarta Sans',sans-serif" }}>🗑</button>
        <button onClick={()=>onSalvar({ nome:nome.trim(), marca:marca.trim(), modelo:modelo.trim(), detalhe:detalhe.trim(), quantidade:parseFloat(qtd)||0, unidade, categoria, preco:parseFloat(preco)||0 })}
          style={{ flex:1, background:`linear-gradient(135deg,${cat.cor},${cat.cor}99)`, border:"none", borderRadius:12, padding:"13px", color:"#fff", fontWeight:800, fontSize:14, cursor:"pointer", fontFamily:"'Plus Jakarta Sans',sans-serif" }}>
          Salvar alterações
        </button>
      </div>
    </Modal>
  );
}

// ─── Modal confirmação no momento da compra ──────────────────────────────────
function ModalConfirmacao({ item, onConfirmar, onCancelar }) {
  const cat = CATEGORIAS[item.categoria];
  const [qtd,     setQtd]     = useState(String(item.quantidadeCompra ?? item.quantidade));
  const [preco,   setPreco]   = useState((item.precoCompra ?? item.preco) > 0 ? String(item.precoCompra ?? item.preco) : "");
  const [marca,   setMarca]   = useState(item.marca   || "");
  const [modelo,  setModelo]  = useState(item.modelo  || "");
  const [detalhe, setDetalhe] = useState(item.detalhe || "");
  const total = (parseFloat(qtd)||0) * (parseFloat(preco)||0);
  const inp = inpStyle({ width:"100%", boxSizing:"border-box" });
  const lbl = { fontSize:11, color:"rgba(255,255,255,0.4)", fontWeight:700, textTransform:"uppercase", letterSpacing:.8 };

  return (
    <Modal onClose={onCancelar}>
      {/* Categoria + nome */}
      <div style={{ fontSize:11,fontWeight:800,color:cat.cor,textTransform:"uppercase",letterSpacing:1,marginBottom:4 }}>{cat.emoji} {cat.label}</div>
      <div style={{ fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:800,fontSize:20,marginBottom:16,color:"#fff" }}>{item.nome}</div>

      <div style={{ maxHeight:"65vh", overflowY:"auto", paddingRight:2 }}>

        {/* Referência de preparação */}
        <div style={{ background:"rgba(255,255,255,0.04)",borderRadius:12,padding:"10px 14px",marginBottom:16,border:"1px solid rgba(255,255,255,0.08)" }}>
          <div style={{ fontSize:11,color:"rgba(255,255,255,0.3)",fontWeight:700,marginBottom:6,textTransform:"uppercase",letterSpacing:.8 }}>Referência</div>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <div style={{ fontSize:13,color:"rgba(255,255,255,0.55)" }}>
              {item.quantidadeCompra ?? item.quantidade} {item.unidade}
            </div>
            {item.preco>0&&(
              <div style={{ textAlign:"right" }}>
                <div style={{ fontSize:10,color:"rgba(255,255,255,0.25)",fontWeight:700,textTransform:"uppercase" }}>Preço previsto</div>
                <div style={{ fontSize:14,fontWeight:800,color:"rgba(255,255,255,0.45)" }}>R$ {item.preco.toFixed(2)}/un</div>
              </div>
            )}
          </div>
        </div>

        {/* ── Produto ── */}
        <div style={{ fontSize:10,fontWeight:800,color:"rgba(255,255,255,0.22)",textTransform:"uppercase",letterSpacing:1,borderBottom:"1px solid rgba(255,255,255,0.07)",paddingBottom:6,marginBottom:12 }}>
          Confirme o produto
        </div>

        <div style={{ display:"flex",gap:10,marginBottom:10 }}>
          <div style={{ flex:1 }}>
            <label style={lbl}>Marca</label>
            <input type="text" value={marca} onChange={e=>setMarca(e.target.value)} placeholder="ex: Colgate"
              style={{ ...inp, marginTop:6 }} />
          </div>
          <div style={{ flex:1 }}>
            <label style={lbl}>Modelo / Linha</label>
            <input type="text" value={modelo} onChange={e=>setModelo(e.target.value)} placeholder="ex: Tripla Ação"
              style={{ ...inp, marginTop:6 }} />
          </div>
        </div>

        <label style={lbl}>Detalhe adicional</label>
        <input type="text" value={detalhe} onChange={e=>setDetalhe(e.target.value)} placeholder="ex: 180g, zero açúcar…"
          style={{ ...inp, marginTop:6, marginBottom:16 }} />

        {/* ── Quantidade e preço ── */}
        <div style={{ fontSize:10,fontWeight:800,color:"rgba(255,255,255,0.22)",textTransform:"uppercase",letterSpacing:1,borderBottom:"1px solid rgba(255,255,255,0.07)",paddingBottom:6,marginBottom:12 }}>
          Quantidade e preço
        </div>

        <div style={{ display:"flex",gap:10,marginBottom:12 }}>
          <div style={{ flex:1 }}>
            <label style={lbl}>Quantidade</label>
            <input type="number" value={qtd} onChange={e=>setQtd(e.target.value)} min="0" step="0.5"
              style={{ ...inp, marginTop:6 }} />
          </div>
          <div style={{ width:80 }}>
            <label style={lbl}>Unidade</label>
            <div style={{ ...inpStyle({ padding:"13px 12px" }), marginTop:6, color:"rgba(255,255,255,0.5)", fontSize:13 }}>{item.unidade}</div>
          </div>
        </div>

        <label style={lbl}>Preço pago (R$) — quanto custou na loja</label>
        <input type="number" value={preco} onChange={e=>setPreco(e.target.value)} min="0" step="0.01" placeholder="0,00"
          style={{ ...inp, marginTop:6, marginBottom:14, borderColor: preco && item.preco>0 && parseFloat(preco)<item.preco ? "rgba(16,185,129,0.5)" : preco && item.preco>0 && parseFloat(preco)>item.preco ? "rgba(239,68,68,0.4)" : undefined }} />

        {(parseFloat(qtd)||0)>0 && (parseFloat(preco)||0)>0 && (
          <div style={{ background:`${cat.cor}18`,border:`1px solid ${cat.cor}44`,borderRadius:12,padding:"12px 16px",marginBottom:4,display:"flex",justifyContent:"space-between",alignItems:"center" }}>
            <span style={{ fontSize:13,color:"rgba(255,255,255,0.55)",fontWeight:600 }}>Total do item</span>
            <span style={{ fontSize:20,fontWeight:900,fontFamily:"'Plus Jakarta Sans',sans-serif",color:cat.cor }}>R$ {total.toFixed(2)}</span>
          </div>
        )}
      </div>

      <div style={{ display:"flex",gap:10,marginTop:18 }}>
        <button onClick={onCancelar} style={{ flex:1,background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.12)",borderRadius:12,padding:"14px",color:"rgba(255,255,255,0.55)",fontWeight:700,fontSize:14,cursor:"pointer",fontFamily:"'Plus Jakarta Sans',sans-serif" }}>Cancelar</button>
        <button onClick={()=>onConfirmar({ quantidadeCompra:parseFloat(qtd)||0, precoCompra:parseFloat(preco)||0, marca:marca.trim(), modelo:modelo.trim(), detalhe:detalhe.trim() })}
          style={{ flex:2,background:"linear-gradient(135deg,#10B981,#059669)",border:"none",borderRadius:12,padding:"14px",color:"#fff",fontWeight:800,fontSize:14,cursor:"pointer",fontFamily:"'Plus Jakarta Sans',sans-serif" }}>
          ✓ Confirmar e marcar
        </button>
      </div>
    </Modal>
  );
}

// ─── Cabeçalho de categoria reutilizável ─────────────────────────────────────
function CatHeader({ catKey, grupo, showTotal }) {
  const cat = CATEGORIAS[catKey];
  const total = grupo.filter(i=>i.quantidade>0).reduce((a,i)=>a+(i.preco*(i.quantidadeCompra??i.quantidade)),0);
  const marcados = grupo.filter(i=>i.marcado).length;
  return (
    <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10 }}>
      <div style={{ display:"flex",alignItems:"center",gap:8 }}>
        <div style={{ width:4,height:18,background:cat.cor,borderRadius:999 }} />
        <span style={{ fontSize:12,fontWeight:800,color:cat.cor,textTransform:"uppercase",letterSpacing:1 }}>{cat.emoji} {cat.label}</span>
        <span style={{ background:`${cat.cor}22`,color:cat.cor,borderRadius:999,padding:"2px 8px",fontSize:11,fontWeight:700 }}>{grupo.length}</span>
        {marcados>0 && <span style={{ background:"rgba(16,185,129,0.15)",color:"#34d399",borderRadius:999,padding:"2px 8px",fontSize:10,fontWeight:700 }}>✓ {marcados}</span>}
      </div>
      {showTotal && total>0 && <span style={{ fontSize:12,color:"rgba(255,255,255,0.35)",fontWeight:700 }}>R$ {total.toFixed(2)}</span>}
    </div>
  );
}

// ─── TELA 0: Home ────────────────────────────────────────────────────────────
function TelaHome({ itens, historico, temRascunho, selecionados, onIrListaBase, onIrPreparar, onIrComprar, onIrHistorico, onIrLocalizacao, onImportarLista }) {
  const totalBase = itens.filter(i=>i.quantidade>0).reduce((a,i)=>a+(i.preco*i.quantidade),0);
  const mesAtual  = new Date().toLocaleString("pt-BR",{month:"long"});
  const gastoMes  = historico.filter(r=>{ const d=new Date(r.data),n=new Date(); return d.getMonth()===n.getMonth()&&d.getFullYear()===n.getFullYear(); }).reduce((a,r)=>a+r.pago,0);
  const econMes   = historico.filter(r=>{ const d=new Date(r.data),n=new Date(); return d.getMonth()===n.getMonth()&&d.getFullYear()===n.getFullYear()&&r.economia>0; }).reduce((a,r)=>a+r.economia,0);
  const totalSel  = itens.filter(i=>selecionados.includes(i.id)).reduce((a,i)=>a+(i.preco||0)*(i.quantidadeCompra??i.quantidade??1),0);

  return (
    <div style={BASE}>
      <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800;900&display=swap" rel="stylesheet" />
      <style>{`@keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}`}</style>

      <div style={{ padding:"36px 24px 20px", textAlign:"center", animation:"fadeUp 0.3s ease" }}>
        <div style={{ fontSize:52, marginBottom:10 }}>🛒</div>
        <div style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontWeight:800, fontSize:28, marginBottom:6 }}>Lista de Compras</div>
        <div style={{ fontSize:13, color:"rgba(255,255,255,0.4)" }}>
          {new Date().toLocaleDateString("pt-BR",{weekday:"long",day:"numeric",month:"long"})}
        </div>
      </div>

      <div style={{ maxWidth:480, margin:"0 auto", padding:"0 18px 48px" }}>

        {temRascunho && (
          <div style={{ background:"rgba(16,185,129,0.1)", border:"1.5px solid rgba(16,185,129,0.3)", borderRadius:18, padding:"15px 18px", marginBottom:18, display:"flex", justifyContent:"space-between", alignItems:"center", animation:"fadeUp 0.35s ease" }}>
            <div>
              <div style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontWeight:800, fontSize:14, color:"#34d399", marginBottom:3 }}>📝 Lista preparada salva</div>
              <div style={{ fontSize:12, color:"rgba(255,255,255,0.45)" }}>{selecionados.length} itens{totalSel>0?` · Estimado R$ ${totalSel.toFixed(2)}`:""}</div>
            </div>
            <button onClick={onIrComprar} style={{ background:"linear-gradient(135deg,#10B981,#059669)", border:"none", borderRadius:12, padding:"11px 16px", color:"#fff", fontFamily:"'Plus Jakarta Sans',sans-serif", fontWeight:800, fontSize:13, cursor:"pointer", whiteSpace:"nowrap" }}>
              🛒 Ir comprar
            </button>
          </div>
        )}

        {/* Importar lista recebida pelo WhatsApp */}
        <label style={{ display:"block", background:"rgba(99,102,241,0.08)", border:"1.5px dashed rgba(99,102,241,0.3)", borderRadius:16, padding:"14px 18px", marginBottom:16, cursor:"pointer", animation:"fadeUp 0.38s ease" }}>
          <input type="file" accept=".json,application/json" style={{ display:"none" }} onChange={e=>{
            const file = e.target.files[0];
            if(!file) return;
            const reader = new FileReader();
            reader.onload = ev => {
              try {
                const data = JSON.parse(ev.target.result);
                if(data.versao===1 && Array.isArray(data.itens)) onImportarLista(data);
                else alert("Arquivo inválido. Use uma lista exportada pelo app.");
              } catch { alert("Não foi possível ler o arquivo."); }
            };
            reader.readAsText(file);
            e.target.value = "";
          }}/>
          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            <div style={{ fontSize:28 }}>📥</div>
            <div>
              <div style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontWeight:800, fontSize:13, color:"#a5b4fc", marginBottom:2 }}>Importar lista recebida</div>
              <div style={{ fontSize:11, color:"rgba(255,255,255,0.4)" }}>Toque para abrir o arquivo .json recebido pelo WhatsApp</div>
            </div>
          </div>
        </label>

        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:12 }}>
          <button onClick={onIrListaBase} style={{ background:"linear-gradient(145deg,rgba(99,102,241,0.22),rgba(139,92,246,0.12))", border:"1.5px solid rgba(99,102,241,0.35)", borderRadius:20, padding:"20px 16px", textAlign:"left", cursor:"pointer", color:"#fff", animation:"fadeUp 0.4s ease" }}>
            <div style={{ fontSize:34, marginBottom:10 }}>📋</div>
            <div style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontWeight:800, fontSize:15, color:"#fff", marginBottom:4 }}>Lista Base</div>
            <div style={{ fontSize:11, color:"rgba(255,255,255,0.45)", lineHeight:1.5 }}>Ver e editar seus produtos</div>
            <div style={{ marginTop:10, background:"rgba(99,102,241,0.2)", borderRadius:8, padding:"4px 10px", display:"inline-block", fontSize:11, fontWeight:700, color:"#a5b4fc", fontFamily:"'Plus Jakarta Sans',sans-serif" }}>
              {itens.filter(i=>i.quantidade>0).length} itens
            </div>
          </button>
          <button onClick={onIrPreparar} style={{ background:"linear-gradient(145deg,rgba(99,102,241,0.32),rgba(139,92,246,0.22))", border:"1.5px solid rgba(99,102,241,0.5)", borderRadius:20, padding:"20px 16px", textAlign:"left", cursor:"pointer", color:"#fff", animation:"fadeUp 0.45s ease" }}>
            <div style={{ fontSize:34, marginBottom:10 }}>✅</div>
            <div style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontWeight:800, fontSize:15, color:"#fff", marginBottom:4 }}>Preparar Compra</div>
            <div style={{ fontSize:11, color:"rgba(255,255,255,0.45)", lineHeight:1.5 }}>Selecionar itens para o mercado</div>
            {totalBase>0 && <div style={{ marginTop:10, background:"rgba(16,185,129,0.15)", borderRadius:8, padding:"4px 10px", display:"inline-block", fontSize:11, fontWeight:700, color:"#34d399", fontFamily:"'Plus Jakarta Sans',sans-serif" }}>R$ {totalBase.toFixed(0)} na base</div>}
          </button>
        </div>

        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
          <button onClick={onIrHistorico} style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.09)", borderRadius:20, padding:"20px 16px", textAlign:"left", cursor:"pointer", color:"#fff", animation:"fadeUp 0.5s ease" }}>
            <div style={{ fontSize:34, marginBottom:10 }}>📊</div>
            <div style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontWeight:800, fontSize:15, color:"#fff", marginBottom:4 }}>Histórico</div>
            <div style={{ fontSize:11, color:"rgba(255,255,255,0.45)", lineHeight:1.5 }}>Gastos semanais e mensais</div>
            {historico.length>0 && <div style={{ marginTop:10, background:"rgba(99,102,241,0.12)", borderRadius:8, padding:"4px 10px", display:"inline-block", fontSize:11, fontWeight:700, color:"#a5b4fc", fontFamily:"'Plus Jakarta Sans',sans-serif" }}>{historico.length} compras</div>}
          </button>
          <button onClick={onIrLocalizacao} style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.09)", borderRadius:20, padding:"20px 16px", textAlign:"left", cursor:"pointer", color:"#fff", animation:"fadeUp 0.55s ease" }}>
            <div style={{ fontSize:34, marginBottom:10 }}>🗺️</div>
            <div style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontWeight:800, fontSize:15, color:"#fff", marginBottom:4 }}>Supermercados</div>
            <div style={{ fontSize:11, color:"rgba(255,255,255,0.45)", lineHeight:1.5 }}>Mercados na sua região</div>
          </button>
        </div>

        {(gastoMes>0||econMes>0) && (
          <div style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:16, padding:"16px 20px", marginTop:14, display:"flex", justifyContent:"space-between", alignItems:"center", animation:"fadeUp 0.6s ease" }}>
            <div>
              <div style={{ fontSize:10, color:"rgba(255,255,255,0.35)", fontWeight:700, textTransform:"uppercase", letterSpacing:.8, marginBottom:4 }}>Gasto em {mesAtual}</div>
              <div style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontWeight:900, fontSize:24, color:"#a5b4fc" }}>R$ {gastoMes.toFixed(2)}</div>
            </div>
            <div style={{ width:1, height:40, background:"rgba(255,255,255,0.08)" }}/>
            <div style={{ textAlign:"right" }}>
              <div style={{ fontSize:10, color:"rgba(255,255,255,0.35)", fontWeight:700, textTransform:"uppercase", letterSpacing:.8, marginBottom:4 }}>Economizado</div>
              <div style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontWeight:900, fontSize:24, color:"#34d399" }}>R$ {econMes.toFixed(2)}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── TELA 1: Lista Base ───────────────────────────────────────────────────────
function TelaListaBase({ itens, setItens, onIrParaPreparar, onVerHistorico, historico, temRascunho, onVoltar }) {
  const [novoItem,    setNovoItem]    = useState("");
  const [novaMarca,   setNovaMarca]   = useState("");
  const [novoModelo,  setNovoModelo]  = useState("");
  const [novoDetalhe, setNovoDetalhe] = useState("");
  const [novaQtd,     setNovaQtd]     = useState("1");
  const [novaUnidade, setNovaUnidade] = useState("un");
  const [novoPreco,   setNovoPreco]   = useState("");
  const [catAtiva,    setCatAtiva]    = useState("higiene");
  const [busca,       setBusca]       = useState("");
  const [filtroCat,   setFiltroCat]   = useState("todas");
  const [mostrarZero, setMostrarZero] = useState(true);
  const [sugestoes,   setSugestoes]   = useState(false);
  const [editando,    setEditando]    = useState(null);

  const adicionarItem = (nomeItem) => {
    const nome = (nomeItem||novoItem).trim();
    if (!nome) return;
    setItens(prev=>[...prev,{ id:proximoId++,nome,marca:novaMarca.trim(),modelo:novoModelo.trim(),detalhe:novoDetalhe.trim(),quantidade:parseFloat(novaQtd)||1,unidade:novaUnidade,categoria:catAtiva,preco:parseFloat(novoPreco)||0 }]);
    setNovoItem(""); setNovaMarca(""); setNovoModelo(""); setNovoDetalhe(""); setNovaQtd("1"); setNovaUnidade("un"); setNovoPreco(""); setSugestoes(false);
  };

  const salvarEdicao = (id, dados) => { setItens(prev=>prev.map(i=>i.id===id?{...i,...dados}:i)); setEditando(null); };
  const removerItem  = (id)        => { setItens(prev=>prev.filter(i=>i.id!==id));                setEditando(null); };

  const filtrados = useMemo(()=>itens.filter(i=>{
    const mb = i.nome.toLowerCase().includes(busca.toLowerCase());
    const mc = filtroCat==="todas"||i.categoria===filtroCat;
    const mz = mostrarZero||i.quantidade>0;
    return mb&&mc&&mz;
  }),[itens,busca,filtroCat,mostrarZero]);

  const porCategoria = useMemo(()=>{
    const g={}; filtrados.forEach(i=>{ if(!g[i.categoria])g[i.categoria]=[]; g[i.categoria].push(i); }); return g;
  },[filtrados]);

  const semPreco   = itens.filter(i=>i.quantidade>0&&!i.preco).length;
  const totalBase  = itens.filter(i=>i.quantidade>0).reduce((a,i)=>a+(i.preco*i.quantidade),0);
  const sugestoesFilt = (SUGERIDOS[catAtiva]||[]).filter(s=>s.toLowerCase().includes(novoItem.toLowerCase())&&!itens.some(i=>i.nome.toLowerCase()===s.toLowerCase())).slice(0,5);
  const inp = inpStyle();

  const [aba, setAba] = useState("itens"); // itens | adicionar

  return (
    <div style={BASE}>
      <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800;900&display=swap" rel="stylesheet" />
      {editando && <ModalEdicao item={editando} onSalvar={d=>salvarEdicao(editando.id,d)} onFechar={()=>setEditando(null)} onRemover={()=>removerItem(editando.id)} />}

      {/* Header com abas */}
      <div style={{ background:"rgba(255,255,255,0.04)",backdropFilter:"blur(20px)",borderBottom:"1px solid rgba(255,255,255,0.08)",padding:"14px 20px 0",position:"sticky",top:0,zIndex:100 }}>
        <div style={{ maxWidth:660,margin:"0 auto" }}>
          <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12 }}>
            <div style={{ display:"flex",alignItems:"center",gap:12 }}>
              <button onClick={onVoltar} style={{ background:"rgba(255,255,255,0.07)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:10,padding:"7px 12px",color:"rgba(255,255,255,0.6)",fontSize:13,fontWeight:700,cursor:"pointer" }}>← Início</button>
              <div>
                <div style={{ fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:800,fontSize:20 }}>📋 Lista Base</div>
                <div style={{ fontSize:12,color:"rgba(255,255,255,0.4)",marginTop:1 }}>{itens.filter(i=>i.quantidade>0).length} itens cadastrados</div>
              </div>
            </div>
          </div>
          {/* Abas */}
          <div style={{ display:"flex",gap:4,background:"rgba(255,255,255,0.05)",borderRadius:12,padding:4,marginBottom:0 }}>
            {[["itens","📦 Meus Itens"],["adicionar","➕ Adicionar Item"]].map(([v,l])=>(
              <button key={v} onClick={()=>setAba(v)}
                style={{ flex:1,padding:"10px",borderRadius:9,border:"none",background:aba===v?"rgba(99,102,241,0.4)":"transparent",color:aba===v?"#fff":"rgba(255,255,255,0.4)",fontWeight:800,fontSize:13,cursor:"pointer",fontFamily:"'Plus Jakarta Sans',sans-serif",transition:"all 0.18s" }}>
                {l}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth:660,margin:"0 auto",padding:"20px 16px" }}>

        {/* ABA: Adicionar item */}
        {aba === "adicionar" && (
        <div>
          <div style={{ background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:20,padding:20,marginBottom:20 }}>
          <div style={{ fontSize:11,fontWeight:800,color:"rgba(255,255,255,0.4)",textTransform:"uppercase",letterSpacing:1,marginBottom:14 }}>➕ Adicionar item</div>

          {/* Categoria */}
          <div style={{ display:"flex",gap:6,marginBottom:16,overflowX:"auto",paddingBottom:4 }}>
            {Object.entries(CATEGORIAS).map(([k,c])=>(
              <button key={k} onClick={()=>setCatAtiva(k)} style={{ flexShrink:0,padding:"7px 13px",borderRadius:999,border:`2px solid ${catAtiva===k?c.cor:"rgba(255,255,255,0.1)"}`,background:catAtiva===k?`${c.cor}22`:"transparent",color:catAtiva===k?c.cor:"rgba(255,255,255,0.4)",fontSize:11,fontWeight:700,cursor:"pointer",whiteSpace:"nowrap" }}>
                {c.emoji} {c.label}
              </button>
            ))}
          </div>

          {/* Nome com sugestões */}
          <div style={{ fontSize:10,fontWeight:800,color:"rgba(255,255,255,0.22)",textTransform:"uppercase",letterSpacing:1,borderBottom:"1px solid rgba(255,255,255,0.07)",paddingBottom:6,marginBottom:12 }}>
            Identificação
          </div>

          <div style={{ position:"relative",marginBottom:10 }}>
            <label style={{ fontSize:11,color:"rgba(255,255,255,0.4)",fontWeight:700,textTransform:"uppercase",letterSpacing:.8 }}>Nome do produto *</label>
            <input type="text" value={novoItem}
              onChange={e=>{setNovoItem(e.target.value);setSugestoes(true);}}
              onKeyDown={e=>e.key==="Enter"&&adicionarItem()}
              placeholder="ex: Creme Dental"
              style={{ ...inp,width:"100%",boxSizing:"border-box",marginTop:6 }} />
            {sugestoes&&novoItem&&sugestoesFilt.length>0&&(
              <div style={{ position:"absolute",top:"calc(100% + 4px)",left:0,right:0,background:"#1e1e3a",border:"1px solid rgba(255,255,255,0.12)",borderRadius:12,overflow:"hidden",zIndex:100,boxShadow:"0 20px 60px rgba(0,0,0,0.5)" }}>
                {sugestoesFilt.map(s=>(
                  <button key={s} onClick={()=>{setNovoItem(s);setSugestoes(false);}} style={{ display:"block",width:"100%",padding:"11px 16px",background:"transparent",border:"none",borderBottom:"1px solid rgba(255,255,255,0.06)",color:"#fff",fontSize:13,cursor:"pointer",textAlign:"left",fontFamily:"'Plus Jakarta Sans',sans-serif" }}
                    onMouseEnter={e=>e.currentTarget.style.background="rgba(255,255,255,0.07)"}
                    onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                    {CATEGORIAS[catAtiva].emoji} {s}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div style={{ display:"flex",gap:10,marginBottom:10 }}>
            <div style={{ flex:1 }}>
              <label style={{ fontSize:11,color:"rgba(255,255,255,0.4)",fontWeight:700,textTransform:"uppercase",letterSpacing:.8 }}>Marca</label>
              <input type="text" value={novaMarca} onChange={e=>setNovaMarca(e.target.value)} placeholder="ex: Colgate"
                style={{ ...inp,width:"100%",boxSizing:"border-box",marginTop:6 }} />
            </div>
            <div style={{ flex:1 }}>
              <label style={{ fontSize:11,color:"rgba(255,255,255,0.4)",fontWeight:700,textTransform:"uppercase",letterSpacing:.8 }}>Modelo / Linha</label>
              <input type="text" value={novoModelo} onChange={e=>setNovoModelo(e.target.value)} placeholder="ex: Tripla Ação"
                style={{ ...inp,width:"100%",boxSizing:"border-box",marginTop:6 }} />
            </div>
          </div>

          <div style={{ marginBottom:16 }}>
            <label style={{ fontSize:11,color:"rgba(255,255,255,0.4)",fontWeight:700,textTransform:"uppercase",letterSpacing:.8 }}>Detalhe adicional</label>
            <input type="text" value={novoDetalhe} onChange={e=>setNovoDetalhe(e.target.value)} placeholder="ex: 180g, caixa c/12, zero açúcar…"
              style={{ ...inp,width:"100%",boxSizing:"border-box",marginTop:6 }} />
          </div>

          {/* Quantidade, grandeza e preço */}
          <div style={{ fontSize:10,fontWeight:800,color:"rgba(255,255,255,0.22)",textTransform:"uppercase",letterSpacing:1,borderBottom:"1px solid rgba(255,255,255,0.07)",paddingBottom:6,marginBottom:12 }}>
            Quantidade e preço
          </div>

          <div style={{ display:"flex",gap:8,alignItems:"flex-end" }}>
            <div>
              <label style={{ fontSize:11,color:"rgba(255,255,255,0.4)",fontWeight:700,textTransform:"uppercase",letterSpacing:.8 }}>Qtd</label>
              <input type="number" value={novaQtd} onChange={e=>setNovaQtd(e.target.value)} min="0" step="0.5"
                style={{ ...inp,width:72,display:"block",marginTop:6 }} />
            </div>
            <div>
              <label style={{ fontSize:11,color:"rgba(255,255,255,0.4)",fontWeight:700,textTransform:"uppercase",letterSpacing:.8 }}>Grandeza</label>
              <select value={novaUnidade} onChange={e=>setNovaUnidade(e.target.value)}
                style={{ ...inp,padding:"12px 8px",display:"block",marginTop:6 }}>
                {["un","kg","g","L","ml","cx","pct","dz"].map(u=><option key={u} value={u} style={{ background:"#1a1a2e" }}>{u}</option>)}
              </select>
            </div>
            <div style={{ flex:1 }}>
              <label style={{ fontSize:11,color:"rgba(255,255,255,0.4)",fontWeight:700,textTransform:"uppercase",letterSpacing:.8 }}>Preço unitário (R$)</label>
              <input type="number" value={novoPreco} onChange={e=>setNovoPreco(e.target.value)} placeholder="0,00" min="0" step="0.01"
                style={{ ...inp,width:"100%",boxSizing:"border-box",display:"block",marginTop:6 }} />
            </div>
          </div>

          {/* Botão confirmar */}
          <button
            onClick={()=>adicionarItem()}
            disabled={!novoItem.trim()}
            style={{
              width:"100%", marginTop:16,
              background: novoItem.trim()
                ? `linear-gradient(135deg,${CATEGORIAS[catAtiva].cor},${CATEGORIAS[catAtiva].cor}bb)`
                : "rgba(255,255,255,0.06)",
              border:"none", borderRadius:14, padding:"15px",
              color: novoItem.trim() ? "#fff" : "rgba(255,255,255,0.25)",
              fontWeight:900, fontSize:15, cursor: novoItem.trim() ? "pointer" : "not-allowed",
              fontFamily:"'Plus Jakarta Sans',sans-serif",
              display:"flex", alignItems:"center", justifyContent:"center", gap:10,
              transition:"all 0.2s",
            }}>
            <span style={{ fontSize:20 }}>✓</span> Adicionar à lista
          </button>
        </div>
        </div>
        )}

        {/* ABA: Meus itens */}
        {aba === "itens" && (
        <div>

        {/* Filtros */}
        <div style={{ display:"flex",gap:8,marginBottom:16,flexWrap:"wrap" }}>
          <input type="text" value={busca} onChange={e=>setBusca(e.target.value)} placeholder="🔍 Buscar item..." style={{ ...inp,flex:1,minWidth:140 }} />
          <select value={filtroCat} onChange={e=>setFiltroCat(e.target.value)} style={{ ...inp,padding:"12px 10px" }}>
            <option value="todas" style={{ background:"#1a1a2e" }}>Todas</option>
            {Object.entries(CATEGORIAS).map(([k,c])=><option key={k} value={k} style={{ background:"#1a1a2e" }}>{c.emoji} {c.label}</option>)}
          </select>
          <button onClick={()=>setMostrarZero(!mostrarZero)} style={{ background:mostrarZero?"rgba(255,255,255,0.06)":"rgba(239,68,68,0.12)",border:`1px solid ${mostrarZero?"rgba(255,255,255,0.1)":"rgba(239,68,68,0.3)"}`,color:mostrarZero?"rgba(255,255,255,0.45)":"#f87171",padding:"12px 12px",borderRadius:11,fontSize:11,fontWeight:700,cursor:"pointer",whiteSpace:"nowrap" }}>
            {mostrarZero?"👁 c/ zerados":"🚫 s/ zerados"}
          </button>
        </div>

        {semPreco>0&&(
          <div style={{ background:"rgba(245,158,11,0.08)",border:"1px solid rgba(245,158,11,0.2)",borderRadius:12,padding:"10px 14px",marginBottom:16,fontSize:12,color:"#fbbf24",fontWeight:600 }}>
            ⚠️ {semPreco} {semPreco===1?"item sem preço":"itens sem preço"} — total pode estar incompleto.
          </div>
        )}

        {/* Lista */}
        {Object.keys(CATEGORIAS).map(catKey=>{
          const grupo = porCategoria[catKey];
          if(!grupo||grupo.length===0) return null;
          const cat = CATEGORIAS[catKey];
          return (
            <div key={catKey} style={{ marginBottom:22 }}>
              <CatHeader catKey={catKey} grupo={grupo} showTotal={true} />
              <div style={{ background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:16,overflow:"hidden" }}>
                {grupo.map((item,idx)=>(
                  <div key={item.id} style={{ display:"flex",alignItems:"center",gap:12,padding:"13px 16px",borderBottom:idx<grupo.length-1?"1px solid rgba(255,255,255,0.05)":"none",background:item.quantidade===0?"rgba(0,0,0,0.15)":"transparent" }}>
                    <div style={{ flex:1,minWidth:0 }}>
                      <div style={{ display:"flex",alignItems:"center",gap:6 }}>
                        <span style={{ fontSize:14,fontWeight:600,color:item.quantidade===0?"rgba(255,255,255,0.3)":"#f0f0f0" }}>{item.nome}</span>
                        {item.quantidade===0&&<span style={{ fontSize:10,background:"rgba(239,68,68,0.15)",color:"#f87171",borderRadius:4,padding:"1px 6px",fontWeight:700 }}>zerado</span>}
                      </div>
                      <div style={{ fontSize:11,color:"rgba(255,255,255,0.28)",marginTop:2 }}>
                        {item.quantidade} {item.unidade}{item.preco>0&&` · R$ ${item.preco.toFixed(2)}/un · R$ ${(item.preco*item.quantidade).toFixed(2)}`}
                      </div>
                    </div>
                    <button onClick={()=>setEditando(item)} style={{ background:"rgba(255,255,255,0.07)",border:"1px solid rgba(255,255,255,0.1)",color:"rgba(255,255,255,0.5)",width:32,height:32,borderRadius:9,cursor:"pointer",fontSize:14,flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center" }}>✏️</button>
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        {totalBase>0&&(
          <div style={{ background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.12)",borderRadius:18,padding:"18px 22px",marginTop:8 }}>
            <div style={{ fontSize:11,color:"rgba(255,255,255,0.35)",fontWeight:700,textTransform:"uppercase",letterSpacing:1 }}>Total da lista base</div>
            <div style={{ fontSize:28,fontWeight:900,fontFamily:"'Plus Jakarta Sans',sans-serif" }}>R$ {totalBase.toFixed(2)}</div>
          </div>
        )}
        <div style={{ height:40 }} />
        </div>
        )}
      </div>
    </div>
  );
}

// ─── Modal quantidade na preparação ──────────────────────────────────────────
function ModalQtdPreparar({ item, onConfirmar, onCancelar }) {
  const cat = CATEGORIAS[item.categoria];
  const [qtd, setQtd] = useState(String(item.quantidadeCompra ?? item.quantidade));

  const confirmar = () => {
    const q = parseFloat(qtd);
    if (!q || q <= 0) return;
    onConfirmar(q);
  };

  return (
    <Modal onClose={onCancelar}>
      <div style={{ fontSize:11,fontWeight:800,color:cat.cor,textTransform:"uppercase",letterSpacing:1,marginBottom:4 }}>{cat.emoji} {cat.label}</div>
      <div style={{ fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:800,fontSize:20,color:"#fff",marginBottom:6 }}>{item.nome}</div>
      <div style={{ fontSize:12,color:"rgba(255,255,255,0.35)",marginBottom:22 }}>
        Referência da lista base: {item.quantidade} {item.unidade}{item.preco>0?` · R$ ${item.preco.toFixed(2)}/un`:""}
      </div>

      <label style={{ fontSize:11,color:"rgba(255,255,255,0.4)",fontWeight:700,textTransform:"uppercase",letterSpacing:.8 }}>
        Quantidade para esta compra
      </label>
      <div style={{ display:"flex",alignItems:"center",gap:10,marginTop:8,marginBottom:24 }}>
        <button onClick={()=>setQtd(v=>String(Math.max(0.5,(parseFloat(v)||1)-0.5)))}
          style={{ width:44,height:44,borderRadius:12,border:"1.5px solid rgba(255,255,255,0.15)",background:"rgba(255,255,255,0.08)",color:"#fff",fontSize:22,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,flexShrink:0 }}>−</button>
        <input type="number" value={qtd} onChange={e=>setQtd(e.target.value)} min="0.5" step="0.5" autoFocus
          style={{ ...inpStyle({ flex:1,textAlign:"center",fontSize:20,fontWeight:800,padding:"12px 10px" }) }} />
        <div style={{ fontSize:14,color:"rgba(255,255,255,0.4)",fontWeight:700,minWidth:28,textAlign:"left" }}>{item.unidade}</div>
        <button onClick={()=>setQtd(v=>String((parseFloat(v)||0)+0.5))}
          style={{ width:44,height:44,borderRadius:12,border:"1.5px solid rgba(255,255,255,0.15)",background:"rgba(255,255,255,0.08)",color:"#fff",fontSize:22,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,flexShrink:0 }}>+</button>
      </div>

      <div style={{ display:"flex",gap:10 }}>
        <button onClick={onCancelar} style={{ flex:1,background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.12)",borderRadius:12,padding:"14px",color:"rgba(255,255,255,0.55)",fontWeight:700,fontSize:14,cursor:"pointer",fontFamily:"'Plus Jakarta Sans',sans-serif" }}>Cancelar</button>
        <button onClick={confirmar} disabled={!(parseFloat(qtd)>0)}
          style={{ flex:2,background:parseFloat(qtd)>0?`linear-gradient(135deg,${cat.cor},${cat.cor}bb)`:"rgba(255,255,255,0.06)",border:"none",borderRadius:12,padding:"14px",color:parseFloat(qtd)>0?"#fff":"rgba(255,255,255,0.25)",fontWeight:800,fontSize:14,cursor:parseFloat(qtd)>0?"pointer":"not-allowed",fontFamily:"'Plus Jakarta Sans',sans-serif" }}>
          ✓ Adicionar à lista
        </button>
      </div>
    </Modal>
  );
}

// ─── TELA 2: Preparar Compra ──────────────────────────────────────────────────
function TelaPreparar({ itens, setItens, selecionados, setSelecionados, onVoltar, onIrComprar }) {
  const [busca,          setBusca]          = useState("");
  const [filtroCat,      setFiltroCat]      = useState("todas");
  const [itemPerguntando, setItemPerguntando] = useState(null); // item aguardando qtd

  const abrirQtd = (item) => setItemPerguntando(item);

  const confirmarQtd = (id, qtd) => {
    // Salva quantidadeCompra no item e adiciona aos selecionados
    setItens(prev => prev.map(i => i.id === id ? { ...i, quantidadeCompra: qtd } : i));
    setSelecionados(prev => [...new Set([...prev, id])]);
    setItemPerguntando(null);
  };

  const desselecionar = (id) => {
    setItens(prev => prev.map(i => i.id === id ? { ...i, quantidadeCompra: undefined } : i));
    setSelecionados(prev => prev.filter(x => x !== id));
  };

  const toggleSel = (item) => {
    if (selecionados.includes(item.id)) desselecionar(item.id);
    else abrirQtd(item);
  };

  // "Selecionar todos" da categoria: adiciona sem perguntar (usa qtd da lista base)
  const selecionarTodos = (grupo) => {
    setItens(prev => prev.map(i => {
      const doGrupo = grupo.find(g => g.id === i.id);
      if (doGrupo && !selecionados.includes(i.id)) return { ...i, quantidadeCompra: i.quantidade };
      return i;
    }));
    setSelecionados(prev => [...new Set([...prev, ...grupo.map(i => i.id)])]);
  };

  const desselecionarTodos = (ids) => {
    setItens(prev => prev.map(i => ids.includes(i.id) ? { ...i, quantidadeCompra: undefined } : i));
    setSelecionados(prev => prev.filter(x => !ids.includes(x)));
  };

  const filtrados = useMemo(()=>itens.filter(i=>i.quantidade>0&&i.nome.toLowerCase().includes(busca.toLowerCase())&&(filtroCat==="todas"||i.categoria===filtroCat)),[itens,busca,filtroCat]);

  const porCategoria = useMemo(()=>{
    const g={}; filtrados.forEach(i=>{ if(!g[i.categoria])g[i.categoria]=[]; g[i.categoria].push(i); }); return g;
  },[filtrados]);

  const totalSel   = selecionados.length;
  const totalEstim = itens.filter(i=>selecionados.includes(i.id)&&i.preco>0).reduce((a,i)=>a+(i.preco*(i.quantidadeCompra??i.quantidade)),0);
  const inp = inpStyle();

  return (
    <div style={BASE}>
      <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800;900&display=swap" rel="stylesheet" />

      {itemPerguntando && (
        <ModalQtdPreparar
          item={itemPerguntando}
          onConfirmar={qtd => confirmarQtd(itemPerguntando.id, qtd)}
          onCancelar={() => setItemPerguntando(null)}
        />
      )}

      {/* Header */}
      <div style={{ background:"rgba(255,255,255,0.04)",backdropFilter:"blur(20px)",borderBottom:"1px solid rgba(255,255,255,0.08)",padding:"16px 20px",position:"sticky",top:0,zIndex:100 }}>
        <div style={{ maxWidth:660,margin:"0 auto" }}>
          <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12 }}>
            <div style={{ display:"flex",alignItems:"center",gap:12 }}>
              <button onClick={onVoltar} style={{ background:"rgba(255,255,255,0.08)",border:"1px solid rgba(255,255,255,0.12)",borderRadius:10,padding:"8px 12px",color:"rgba(255,255,255,0.7)",fontSize:13,fontWeight:700,cursor:"pointer" }}>← Voltar</button>
              <div>
                <div style={{ fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:800,fontSize:20 }}>🗂 Preparar Compra</div>
                <div style={{ fontSize:12,color:"rgba(255,255,255,0.4)",marginTop:2 }}>{totalSel} {totalSel===1?"item selecionado":"itens selecionados"}</div>
              </div>
            </div>
            <button onClick={onIrComprar} disabled={totalSel===0} style={{ background:totalSel>0?"linear-gradient(135deg,#10B981,#059669)":"rgba(255,255,255,0.06)",border:"none",borderRadius:12,padding:"11px 18px",color:totalSel>0?"#fff":"rgba(255,255,255,0.25)",fontWeight:800,fontSize:13,cursor:totalSel>0?"pointer":"not-allowed",fontFamily:"'Plus Jakarta Sans',sans-serif" }}>
              ✓ Ir comprar ({totalSel})
            </button>
          </div>
          {totalEstim>0&&(
            <div style={{ background:"rgba(16,185,129,0.08)",border:"1px solid rgba(16,185,129,0.2)",borderRadius:10,padding:"8px 14px",fontSize:12,color:"#34d399",fontWeight:700,display:"flex",justifyContent:"space-between",alignItems:"center" }}>
              <span>💰 Estimativa: R$ {totalEstim.toFixed(2)}</span>
              {totalSel > 0 && (
                <button onClick={()=>{
                  const itensSel = itens.filter(i=>selecionados.includes(i.id)).map(i=>({
                    nome:i.nome, marca:i.marca||"", modelo:i.modelo||"",
                    unidade:i.unidade, quantidade:i.quantidadeCompra??i.quantidade,
                    preco:i.preco, categoria:i.categoria
                  }));
                  const payload = { versao:1, criado:new Date().toISOString(), itens:itensSel };
                  const blob = new Blob([JSON.stringify(payload,null,2)],{type:"application/json"});
                  const file = new File([blob],"lista-compras.json",{type:"application/json"});
                  if(navigator.share&&navigator.canShare&&navigator.canShare({files:[file]})){
                    navigator.share({ title:"Lista de Compras", text:`Lista com ${itensSel.length} itens — R$ ${totalEstim.toFixed(2)}`, files:[file] });
                  } else {
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement("a"); a.href=url; a.download="lista-compras.json"; a.click();
                    URL.revokeObjectURL(url);
                  }
                }} style={{ background:"rgba(255,255,255,0.15)",border:"none",borderRadius:8,padding:"5px 12px",color:"#fff",fontWeight:800,fontSize:12,cursor:"pointer",fontFamily:"'Plus Jakarta Sans',sans-serif",display:"flex",alignItems:"center",gap:6 }}>
                  📤 Compartilhar lista
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      <div style={{ maxWidth:660,margin:"0 auto",padding:"20px 16px" }}>
        <div style={{ background:"rgba(99,102,241,0.08)",border:"1px solid rgba(99,102,241,0.2)",borderRadius:12,padding:"10px 14px",marginBottom:16,fontSize:12,color:"#a5b4fc",fontWeight:600 }}>
          ☑️ Toque no item para definir a quantidade. Toque novamente para remover da lista.
        </div>

        {/* Filtros */}
        <div style={{ display:"flex",gap:8,marginBottom:16,flexWrap:"wrap" }}>
          <input type="text" value={busca} onChange={e=>setBusca(e.target.value)} placeholder="🔍 Buscar item..." style={{ ...inp,flex:1,minWidth:140 }} />
          <select value={filtroCat} onChange={e=>setFiltroCat(e.target.value)} style={{ ...inp,padding:"12px 10px" }}>
            <option value="todas" style={{ background:"#1a1a2e" }}>Todas</option>
            {Object.entries(CATEGORIAS).map(([k,c])=><option key={k} value={k} style={{ background:"#1a1a2e" }}>{c.emoji} {c.label}</option>)}
          </select>
        </div>

        {/* Lista por categoria */}
        {Object.keys(CATEGORIAS).map(catKey=>{
          const grupo = porCategoria[catKey];
          if(!grupo||grupo.length===0) return null;
          const cat = CATEGORIAS[catKey];
          const ids  = grupo.map(i=>i.id);
          const todosSelCat = ids.every(id=>selecionados.includes(id));
          const algunsSelCat= ids.some(id=>selecionados.includes(id));

          return (
            <div key={catKey} style={{ marginBottom:22 }}>
              <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10 }}>
                <div style={{ display:"flex",alignItems:"center",gap:8 }}>
                  <div style={{ width:4,height:18,background:cat.cor,borderRadius:999 }} />
                  <span style={{ fontSize:12,fontWeight:800,color:cat.cor,textTransform:"uppercase",letterSpacing:1 }}>{cat.emoji} {cat.label}</span>
                  <span style={{ background:`${cat.cor}22`,color:cat.cor,borderRadius:999,padding:"2px 8px",fontSize:11,fontWeight:700 }}>{grupo.length}</span>
                  {algunsSelCat&&<span style={{ background:"rgba(99,102,241,0.15)",color:"#a5b4fc",borderRadius:999,padding:"2px 8px",fontSize:10,fontWeight:700 }}>✓ {ids.filter(id=>selecionados.includes(id)).length}</span>}
                </div>
                <button onClick={()=>todosSelCat?desselecionarTodos(ids):selecionarTodos(grupo)}
                  style={{ background:todosSelCat?`${cat.cor}22`:"rgba(255,255,255,0.06)",border:`1px solid ${todosSelCat?cat.cor:"rgba(255,255,255,0.12)"}`,color:todosSelCat?cat.cor:"rgba(255,255,255,0.45)",borderRadius:8,padding:"5px 10px",fontSize:11,fontWeight:700,cursor:"pointer" }}>
                  {todosSelCat?"Desmarcar todos":"Selecionar todos"}
                </button>
              </div>

              <div style={{ background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:16,overflow:"hidden" }}>
                {grupo.map((item,idx)=>{
                  const sel = selecionados.includes(item.id);
                  return (
                    <div key={item.id} onClick={()=>toggleSel(item)} style={{ display:"flex",alignItems:"center",gap:12,padding:"13px 16px",borderBottom:idx<grupo.length-1?"1px solid rgba(255,255,255,0.05)":"none",background:sel?"rgba(99,102,241,0.09)":"transparent",cursor:"pointer",transition:"background 0.15s" }}
                      onMouseEnter={e=>{ if(!sel)e.currentTarget.style.background="rgba(255,255,255,0.04)"; }}
                      onMouseLeave={e=>{ e.currentTarget.style.background=sel?"rgba(99,102,241,0.09)":"transparent"; }}>
                      <div style={{ width:26,height:26,borderRadius:8,border:`2px solid ${sel?cat.cor:"rgba(255,255,255,0.2)"}`,background:sel?cat.cor:"transparent",flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,color:"#fff",transition:"all 0.2s" }}>
                        {sel?"✓":""}
                      </div>
                      <div style={{ flex:1,minWidth:0 }}>
                        <span style={{ fontSize:14,fontWeight:600,color:sel?"#fff":"rgba(255,255,255,0.7)" }}>{item.nome}</span>
                        <div style={{ fontSize:11,color:"rgba(255,255,255,0.28)",marginTop:2 }}>
                          {sel
                            ? <span style={{ color:`${cat.cor}cc`,fontWeight:700 }}>{item.quantidadeCompra??item.quantidade} {item.unidade}{item.preco>0?` · R$ ${(item.preco*(item.quantidadeCompra??item.quantidade)).toFixed(2)}`:""}</span>
                            : <>{item.quantidade} {item.unidade}{item.preco>0&&` · R$ ${item.preco.toFixed(2)}/un`}</>
                          }
                        </div>
                      </div>
                      {sel
                        ? <button onClick={e=>{e.stopPropagation();abrirQtd(item);}} style={{ background:`${cat.cor}22`,border:`1px solid ${cat.cor}44`,color:cat.cor,width:30,height:30,borderRadius:8,cursor:"pointer",fontSize:13,flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center" }}>✎</button>
                        : <span style={{ fontSize:18,color:"rgba(255,255,255,0.15)",flexShrink:0 }}>+</span>
                      }
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}

        {/* Botão fixo no fundo */}
        {totalSel>0&&(
          <div style={{ position:"sticky",bottom:20,marginTop:8 }}>
            <button onClick={onIrComprar} style={{ width:"100%",background:"linear-gradient(135deg,#10B981,#059669)",border:"none",borderRadius:16,padding:"18px",color:"#fff",fontWeight:900,fontSize:16,cursor:"pointer",fontFamily:"'Plus Jakarta Sans',sans-serif",boxShadow:"0 8px 30px rgba(16,185,129,0.4)" }}>
              🏪 Ir comprar {totalSel} {totalSel===1?"item":"itens"} {totalEstim>0&&`· R$ ${totalEstim.toFixed(2)}`}
            </button>
          </div>
        )}
        <div style={{ height:30 }} />
      </div>
    </div>
  );
}


// ─── TELA 3: Supermercados na Região ────────────────────────────────────────
function TelaSupermercados({ itens, selecionados, onPular, onVoltar }) {
  const [fase, setFase]             = useState("pergunta"); // pergunta | localizando | resultado
  const [coords, setCoords]         = useState(null); // {lat, lng}
  const [cidadeManual, setCidadeManual] = useState("");
  const [usandoManual, setUsandoManual] = useState(false);
  const [localLabel, setLocalLabel] = useState("");

  const itensCompra = itens.filter(i => selecionados.includes(i.id));
  const totalEstimado = itensCompra.reduce((a, i) => a + (i.preco || 0) * (i.quantidadeCompra ?? i.quantidade ?? 1), 0);

  // Busca Maps focada em supermercados físicos — sem marketplaces
  const buscarPorGPS = () => {
    setFase("localizando");
    if (!navigator.geolocation) { setUsandoManual(true); setFase("pergunta"); return; }
    navigator.geolocation.getCurrentPosition(
      pos => {
        const { latitude: lat, longitude: lng } = pos.coords;
        setCoords({ lat, lng });
        // Reverse geocode via nominatim para pegar cidade
        fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`)
          .then(r=>r.json())
          .then(d=>{
            const cidade = d.address?.city || d.address?.town || d.address?.village || "";
            const estado = d.address?.state_code || d.address?.state || "";
            setLocalLabel(cidade ? `${cidade}${estado?", "+estado:""}` : `${lat.toFixed(4)}, ${lng.toFixed(4)}`);
          })
          .catch(()=>setLocalLabel(`${lat.toFixed(4)}, ${lng.toFixed(4)}`));
        setFase("resultado");
      },
      () => { setUsandoManual(true); setFase("pergunta"); },
      { timeout: 10000, maximumAge: 60000 }
    );
  };

  // ── Manual ─────────────────────────────────────────────────────────────────
  const buscarPorTexto = () => {
    if (!cidadeManual.trim()) return;
    setCoords(null);
    setLocalLabel(cidadeManual.trim());
    setFase("resultado");
  };

  // ── Abrir Maps — busca supermercados físicos somente ───────────────────────
  const abrirMapsGeral = () => {
    // "supermercado" filtra fisicamente; evita Mercado Livre e similares
    if (coords) {
      window.open(`https://www.google.com/maps/search/supermercado/@${coords.lat},${coords.lng},14z`, "_blank");
    } else {
      window.open(`https://www.google.com/maps/search/supermercado+${encodeURIComponent(localLabel)}`, "_blank");
    }
  };

  const abrirMapsRota = (nome) => {
    if (coords) {
      window.open(`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(nome+" "+localLabel)}&travelmode=driving`, "_blank");
    } else {
      window.open(`https://www.google.com/maps/search/${encodeURIComponent(nome+" "+localLabel)}`, "_blank");
    }
  };

  const BASE_STYLE = { minHeight:"100vh", background:"linear-gradient(160deg,#0f0c29,#1a1a2e,#16213e)", fontFamily:"'Plus Jakarta Sans',sans-serif", color:"#f0f0f0" };
  const FONTS = <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800;900&display=swap" rel="stylesheet" />;

  // ══ PERGUNTA ════════════════════════════════════════════════════════════════
  if (fase === "pergunta") return (
    <div style={BASE_STYLE}>
      {FONTS}
      <div style={{ background:"rgba(255,255,255,0.04)", backdropFilter:"blur(20px)", borderBottom:"1px solid rgba(255,255,255,0.08)", padding:"14px 20px" }}>
        <div style={{ maxWidth:620, margin:"0 auto", display:"flex", alignItems:"center", gap:12 }}>
          <button onClick={onVoltar} style={{ background:"rgba(255,255,255,0.07)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:10, padding:"8px 14px", color:"rgba(255,255,255,0.6)", fontSize:13, fontWeight:700, cursor:"pointer" }}>← Voltar</button>
          <span style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontWeight:800, fontSize:18 }}>Supermercados na Região</span>
        </div>
      </div>

      <div style={{ maxWidth:560, margin:"0 auto", padding:"32px 20px" }}>

        {/* Hero */}
        <div style={{ textAlign:"center", marginBottom:28 }}>
          <div style={{ fontSize:64, marginBottom:14, lineHeight:1 }}>🗺️</div>
          <div style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontWeight:800, fontSize:24, marginBottom:10 }}>
            Onde comprar na sua cidade?
          </div>
          <div style={{ fontSize:14, color:"rgba(255,255,255,0.5)", lineHeight:1.7, maxWidth:380, margin:"0 auto" }}>
            Vou localizar os supermercados mais próximos de você para facilitar sua escolha.
          </div>
        </div>

        {/* Resumo da lista */}
        <div style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:16, padding:"14px 18px", marginBottom:24 }}>
          <div style={{ fontSize:11, fontWeight:800, color:"rgba(255,255,255,0.3)", textTransform:"uppercase", letterSpacing:1, marginBottom:10 }}>Sua lista de compras</div>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <div style={{ fontSize:14, color:"rgba(255,255,255,0.7)" }}>
              <strong style={{ color:"#fff", fontSize:20 }}>{itensCompra.length}</strong> itens selecionados
            </div>
            {totalEstimado > 0 && (
              <div style={{ textAlign:"right" }}>
                <div style={{ fontSize:10, color:"rgba(255,255,255,0.35)", fontWeight:700, textTransform:"uppercase" }}>Total estimado</div>
                <div style={{ fontSize:18, fontWeight:900, fontFamily:"'Plus Jakarta Sans',sans-serif", color:"#a5b4fc" }}>R$ {totalEstimado.toFixed(2)}</div>
              </div>
            )}
          </div>
        </div>

        {/* Botões GPS / Manual */}
        {!usandoManual ? (
          <>
            <button onClick={buscarPorGPS} style={{ width:"100%", background:"linear-gradient(135deg,#6366f1,#8B5CF6)", border:"none", borderRadius:16, padding:"18px", color:"#fff", fontWeight:900, fontSize:16, cursor:"pointer", fontFamily:"'Plus Jakarta Sans',sans-serif", boxShadow:"0 8px 32px rgba(99,102,241,0.4)", marginBottom:12, display:"flex", alignItems:"center", justifyContent:"center", gap:10 }}>
              <span style={{ fontSize:22 }}>📍</span> Usar minha localização
            </button>
            <button onClick={() => setUsandoManual(true)} style={{ width:"100%", background:"rgba(255,255,255,0.05)", border:"1.5px solid rgba(255,255,255,0.12)", borderRadius:16, padding:"14px", color:"rgba(255,255,255,0.55)", fontWeight:700, fontSize:14, cursor:"pointer", fontFamily:"'Plus Jakarta Sans',sans-serif", marginBottom:12 }}>
              ✏️ Digitar minha cidade ou bairro
            </button>
          </>
        ) : (
          <div style={{ marginBottom:12 }}>
            <div style={{ fontSize:12, color:"rgba(255,255,255,0.4)", marginBottom:8, fontWeight:700 }}>📍 Sua cidade ou bairro:</div>
            <div style={{ display:"flex", gap:8, marginBottom:8 }}>
              <input type="text" value={cidadeManual} onChange={e => setCidadeManual(e.target.value)}
                onKeyDown={e => e.key === "Enter" && buscarPorTexto()}
                placeholder="ex: Moema São Paulo / Centro Curitiba"
                style={{ flex:1, background:"rgba(255,255,255,0.07)", border:"1.5px solid rgba(255,255,255,0.15)", borderRadius:12, padding:"14px 16px", color:"#fff", fontSize:14, fontFamily:"'Plus Jakarta Sans',sans-serif", outline:"none" }}
                autoFocus />
              <button onClick={buscarPorTexto} disabled={!cidadeManual.trim()}
                style={{ background: cidadeManual.trim() ? "linear-gradient(135deg,#6366f1,#8B5CF6)" : "rgba(255,255,255,0.05)", border:"none", borderRadius:12, padding:"14px 20px", color: cidadeManual.trim() ? "#fff" : "rgba(255,255,255,0.2)", fontWeight:900, fontSize:20, cursor: cidadeManual.trim() ? "pointer" : "not-allowed" }}>→</button>
            </div>
            <button onClick={() => setUsandoManual(false)} style={{ background:"none", border:"none", color:"rgba(255,255,255,0.3)", fontSize:12, cursor:"pointer", fontFamily:"'Plus Jakarta Sans',sans-serif" }}>
              Tentar GPS novamente
            </button>
          </div>
        )}

        <button onClick={onPular} style={{ width:"100%", background:"rgba(16,185,129,0.1)", border:"1.5px solid rgba(16,185,129,0.3)", borderRadius:16, padding:"15px", color:"#34d399", fontWeight:800, fontSize:15, cursor:"pointer", fontFamily:"'Plus Jakarta Sans',sans-serif", display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}>
          🛒 Pular e ir direto às compras
        </button>
      </div>
    </div>
  );

  // ══ LOCALIZANDO ═════════════════════════════════════════════════════════════
  if (fase === "localizando") return (
    <div style={{ ...BASE_STYLE, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:24 }}>
      {FONTS}
      <style>{`@keyframes spin{to{transform:rotate(360deg)}} @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}`}</style>
      <div style={{ position:"relative", width:90, height:90, marginBottom:28 }}>
        <div style={{ position:"absolute", inset:0, borderRadius:"50%", border:"3px solid rgba(99,102,241,0.15)" }} />
        <div style={{ position:"absolute", inset:0, borderRadius:"50%", border:"3px solid transparent", borderTopColor:"#6366f1", animation:"spin 1s linear infinite" }} />
        <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center", fontSize:34 }}>🗺️</div>
      </div>
      <div style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontWeight:800, fontSize:20, marginBottom:8, textAlign:"center" }}>Localizando supermercados…</div>
      <div style={{ fontSize:14, color:"rgba(255,255,255,0.4)", textAlign:"center", animation:"pulse 2s ease-in-out infinite" }}>Buscando opções na sua região</div>
    </div>
  );

  // ══ RESULTADO ═══════════════════════════════════════════════════════════════
  if (fase === "resultado") return (
    <div style={BASE_STYLE}>
      {FONTS}
      <style>{`@keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}`}</style>

      {/* Header */}
      <div style={{ background:"rgba(255,255,255,0.04)", backdropFilter:"blur(20px)", borderBottom:"1px solid rgba(255,255,255,0.08)", padding:"14px 20px", position:"sticky", top:0, zIndex:100 }}>
        <div style={{ maxWidth:660, margin:"0 auto", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <div>
            <div style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontWeight:800, fontSize:20 }}>🗺️ Supermercados</div>
            <div style={{ fontSize:12, color:"rgba(255,255,255,0.4)", marginTop:2 }}>
              {coords ? "📍 Localização obtida" : `📍 ${localLabel}`}
            </div>
          </div>
          <button onClick={onPular} style={{ background:"linear-gradient(135deg,#10B981,#059669)", border:"none", borderRadius:12, padding:"11px 18px", color:"#fff", fontWeight:800, fontSize:13, cursor:"pointer", fontFamily:"'Plus Jakarta Sans',sans-serif" }}>
            🛒 Ir comprar
          </button>
        </div>
      </div>

      <div style={{ maxWidth:660, margin:"0 auto", padding:"20px 16px" }}>

        {/* Resumo da lista */}
        <div style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:14, padding:"12px 18px", marginBottom:16, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <div style={{ fontSize:13, color:"rgba(255,255,255,0.6)" }}>
            📋 <strong style={{ color:"#fff" }}>{itensCompra.length} itens</strong> na sua lista
          </div>
          {totalEstimado > 0 && (
            <div style={{ textAlign:"right" }}>
              <div style={{ fontSize:10, color:"rgba(255,255,255,0.35)", fontWeight:700, textTransform:"uppercase" }}>Estimado</div>
              <div style={{ fontSize:17, fontWeight:900, fontFamily:"'Plus Jakarta Sans',sans-serif", color:"#a5b4fc" }}>R$ {totalEstimado.toFixed(2)}</div>
            </div>
          )}
        </div>

        {/* Botão principal — todos os supermercados próximos */}
        <button onClick={abrirMapsGeral}
          style={{ width:"100%", background:"linear-gradient(135deg,#6366f1,#8B5CF6)", border:"none", borderRadius:16, padding:"18px", color:"#fff", fontWeight:900, fontSize:16, cursor:"pointer", fontFamily:"'Plus Jakarta Sans',sans-serif", boxShadow:"0 8px 32px rgba(99,102,241,0.35)", marginBottom:12, display:"flex", alignItems:"center", justifyContent:"center", gap:10, animation:"fadeIn 0.2s ease" }}>
          <span style={{ fontSize:22 }}>🗺️</span> Ver supermercados no Google Maps
        </button>

        {/* Dica */}
        <div style={{ background:"rgba(99,102,241,0.08)", border:"1px solid rgba(99,102,241,0.2)", borderRadius:12, padding:"10px 14px", marginBottom:20, fontSize:12, color:"#a5b4fc", lineHeight:1.6 }}>
          💡 O Maps abre apenas supermercados físicos na sua cidade. Toque em qualquer um para ver rotas, horários e avaliações.
        </div>

        {/* 7 supermercados físicos típicos por busca individual */}
        <div style={{ fontSize:11, fontWeight:800, color:"rgba(255,255,255,0.3)", textTransform:"uppercase", letterSpacing:.8, marginBottom:12 }}>
          Buscar supermercado específico em {localLabel||"sua cidade"}
        </div>
        {[
          { nome:"Atacadão",          emoji:"🏬" },
          { nome:"Assaí Atacadista",  emoji:"🏬" },
          { nome:"Carrefour",         emoji:"🛒" },
          { nome:"Extra",             emoji:"🛒" },
          { nome:"Pão de Açúcar",     emoji:"🛒" },
          { nome:"Dia Supermercado",  emoji:"🏪" },
          { nome:"Mercado municipal", emoji:"🏪" },
        ].map((m, i) => (
          <div key={i} onClick={() => abrirMapsRota(m.nome)}
            style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:14, padding:"14px 16px", marginBottom:10, display:"flex", alignItems:"center", gap:12, cursor:"pointer", animation:`fadeIn ${0.15+i*0.05}s ease` }}
            onMouseEnter={e=>e.currentTarget.style.background="rgba(255,255,255,0.07)"}
            onMouseLeave={e=>e.currentTarget.style.background="rgba(255,255,255,0.04)"}>
            <div style={{ width:38, height:38, borderRadius:10, background:"rgba(99,102,241,0.18)", border:"1.5px solid rgba(99,102,241,0.28)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, flexShrink:0 }}>{m.emoji}</div>
            <div style={{ flex:1 }}>
              <div style={{ fontWeight:800, fontSize:14, color:"#fff" }}>{m.nome}</div>
              <div style={{ fontSize:11, color:"rgba(255,255,255,0.4)", marginTop:2 }}>Buscar unidade em {localLabel||"sua cidade"}</div>
            </div>
            <div style={{ fontSize:18, color:"rgba(99,102,241,0.7)", flexShrink:0 }}>→</div>
          </div>
        ))}

        {/* Buscar em outro local */}
        <button onClick={() => { setFase("pergunta"); setUsandoManual(true); setCidadeManual(""); }}
          style={{ width:"100%", background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.09)", borderRadius:14, padding:"13px", color:"rgba(255,255,255,0.4)", fontWeight:700, fontSize:13, cursor:"pointer", fontFamily:"'Plus Jakarta Sans',sans-serif" }}>
          🔍 Buscar em outro bairro ou cidade
        </button>
        <div style={{ height:40 }} />
      </div>
    </div>
  );

  return null;
}

// ─── TELA 3: Comprando ────────────────────────────────────────────────────────
function TelaComprando({ itens, selecionados, setItens, onVoltar, onEncerrar }) {
  const [itemConfirmando, setItemConfirmando] = useState(null);
  const [busca,  setBusca]  = useState("");
  const [filtroCat, setFiltroCat] = useState("todas");

  // Apenas itens selecionados na preparação
  const itensCompra = useMemo(()=>itens.filter(i=>selecionados.includes(i.id)),[itens,selecionados]);

  const handleCheck = (item) => {
    if(item.marcado) { setItens(prev=>prev.map(i=>i.id===item.id?{...i,marcado:false}:i)); }
    else             { setItemConfirmando(item); }
  };

  const confirmar = (id,{quantidadeCompra,precoCompra,marca,modelo,detalhe}) => {
    // preco (base) NÃO é alterado — precoCompra guarda o valor real pago
    setItens(prev=>prev.map(i=>i.id===id?{...i,marcado:true,quantidadeCompra,precoCompra,marca,modelo,detalhe}:i));
    setItemConfirmando(null);
  };

  const filtrados = useMemo(()=>itensCompra.filter(i=>i.nome.toLowerCase().includes(busca.toLowerCase())&&(filtroCat==="todas"||i.categoria===filtroCat)),[itensCompra,busca,filtroCat]);

  const porCategoria = useMemo(()=>{
    const g={}; filtrados.forEach(i=>{ if(!g[i.categoria])g[i.categoria]=[]; g[i.categoria].push(i); }); return g;
  },[filtrados]);

  const marcados      = itensCompra.filter(i=>i.marcado);
  // Estimado: preço BASE (cadastrado) × quantidade preparada — nunca muda durante a compra
  const totalEstimado = itensCompra.filter(i=>i.preco>0)
    .reduce((a,i)=>a+(i.preco*(i.quantidadeCompra??i.quantidade)),0);
  // Carrinho: preço PAGO (precoCompra) confirmado no ato × quantidade confirmada
  const totalCarrinho = marcados
    .filter(i=>(i.precoCompra??i.preco)>0)
    .reduce((a,i)=>a+((i.precoCompra??i.preco)*(i.quantidadeCompra??i.quantidade)),0);
  // Diferença: negativo = economia, positivo = gasto a mais
  const diferenca     = totalCarrinho - totalEstimado;
  const economia      = diferenca < -0.009;
  const gastouMais    = diferenca > 0.009;
  const progresso     = itensCompra.length>0?(marcados.length/itensCompra.length)*100:0;
  const inp = inpStyle();

  return (
    <div style={BASE}>
      <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800;900&display=swap" rel="stylesheet" />
      {itemConfirmando&&<ModalConfirmacao item={itemConfirmando} onConfirmar={d=>confirmar(itemConfirmando.id,d)} onCancelar={()=>setItemConfirmando(null)} />}

      {/* Header */}
      <div style={{ background:"rgba(255,255,255,0.04)",backdropFilter:"blur(20px)",borderBottom:"1px solid rgba(255,255,255,0.08)",padding:"16px 20px",position:"sticky",top:0,zIndex:100 }}>
        <div style={{ maxWidth:660,margin:"0 auto" }}>
          <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12 }}>
            <div style={{ display:"flex",alignItems:"center",gap:12 }}>
              <button onClick={onVoltar} style={{ background:"rgba(255,255,255,0.08)",border:"1px solid rgba(255,255,255,0.12)",borderRadius:10,padding:"8px 12px",color:"rgba(255,255,255,0.7)",fontSize:13,fontWeight:700,cursor:"pointer" }}>← Voltar</button>
              <div>
                <div style={{ fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:800,fontSize:20 }}>🏪 Comprando</div>
                <div style={{ fontSize:12,color:"rgba(255,255,255,0.4)",marginTop:2 }}>{marcados.length} de {itensCompra.length} itens</div>
              </div>
            </div>
            {progresso===100&&(
              <button onClick={()=>onEncerrar({estimado:totalEstimado,pago:totalCarrinho,itensCont:marcados.length})} style={{ background:"linear-gradient(135deg,#10B981,#059669)",border:"none",borderRadius:12,padding:"10px 16px",color:"#fff",fontWeight:800,fontSize:12,cursor:"pointer",fontFamily:"'Plus Jakarta Sans',sans-serif" }}>
                ✓ Encerrar
              </button>
            )}
          </div>

          {/* Barra progresso */}
          <div style={{ background:"rgba(255,255,255,0.08)",borderRadius:999,height:10,overflow:"hidden",marginBottom:6 }}>
            <div style={{ background:"linear-gradient(90deg,#10B981,#34d399)",height:"100%",width:`${progresso}%`,borderRadius:999,transition:"width 0.4s ease" }} />
          </div>
          <div style={{ display:"flex",justifyContent:"space-between",fontSize:11,color:"rgba(255,255,255,0.4)" }}>
            <span>{Math.round(progresso)}% concluído</span>
            <span>{totalEstimado>0 ? `Carrinho R$ ${totalCarrinho.toFixed(2)} · Est. R$ ${totalEstimado.toFixed(2)}` : `R$ ${totalCarrinho.toFixed(2)}`}</span>
          </div>
        </div>
      </div>

      <div style={{ maxWidth:660,margin:"0 auto",padding:"20px 16px" }}>
        <div style={{ background:"rgba(16,185,129,0.06)",border:"1px solid rgba(16,185,129,0.18)",borderRadius:12,padding:"10px 14px",marginBottom:16,fontSize:12,color:"#34d399",fontWeight:600 }}>
          ☑️ Toque no item para confirmar quantidade e preço antes de marcar.
        </div>

        {/* Filtros */}
        <div style={{ display:"flex",gap:8,marginBottom:16,flexWrap:"wrap" }}>
          <input type="text" value={busca} onChange={e=>setBusca(e.target.value)} placeholder="🔍 Buscar item..." style={{ ...inp,flex:1,minWidth:140 }} />
          <select value={filtroCat} onChange={e=>setFiltroCat(e.target.value)} style={{ ...inp,padding:"12px 10px" }}>
            <option value="todas" style={{ background:"#1a1a2e" }}>Todas</option>
            {Object.entries(CATEGORIAS).map(([k,c])=><option key={k} value={k} style={{ background:"#1a1a2e" }}>{c.emoji} {c.label}</option>)}
          </select>
        </div>

        {/* Lista */}
        {Object.keys(CATEGORIAS).map(catKey=>{
          const grupo = porCategoria[catKey];
          if(!grupo||grupo.length===0) return null;
          const cat = CATEGORIAS[catKey];
          const totalCat = grupo.filter(i=>i.marcado).reduce((a,i)=>a+(i.preco*(i.quantidadeCompra??i.quantidade)),0);
          const marcadosCat = grupo.filter(i=>i.marcado).length;

          return (
            <div key={catKey} style={{ marginBottom:22 }}>
              <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10 }}>
                <div style={{ display:"flex",alignItems:"center",gap:8 }}>
                  <div style={{ width:4,height:18,background:cat.cor,borderRadius:999 }} />
                  <span style={{ fontSize:12,fontWeight:800,color:cat.cor,textTransform:"uppercase",letterSpacing:1 }}>{cat.emoji} {cat.label}</span>
                  <span style={{ background:`${cat.cor}22`,color:cat.cor,borderRadius:999,padding:"2px 8px",fontSize:11,fontWeight:700 }}>{grupo.length}</span>
                  {marcadosCat>0&&<span style={{ background:"rgba(16,185,129,0.15)",color:"#34d399",borderRadius:999,padding:"2px 8px",fontSize:10,fontWeight:700 }}>✓ {marcadosCat}</span>}
                </div>
                {totalCat>0&&<span style={{ fontSize:12,color:"rgba(255,255,255,0.35)",fontWeight:700 }}>R$ {totalCat.toFixed(2)}</span>}
              </div>

              <div style={{ background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:16,overflow:"hidden" }}>
                {grupo.map((item,idx)=>(
                  <div key={item.id} style={{ display:"flex",alignItems:"center",gap:12,padding:"13px 16px",borderBottom:idx<grupo.length-1?"1px solid rgba(255,255,255,0.05)":"none",background:item.marcado?"rgba(16,185,129,0.07)":"transparent",transition:"background 0.2s" }}>
                    <button onClick={()=>handleCheck(item)} style={{ width:28,height:28,borderRadius:9,border:`2px solid ${item.marcado?"#10B981":"rgba(255,255,255,0.2)"}`,background:item.marcado?"#10B981":"transparent",cursor:"pointer",flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,color:"#fff",transition:"all 0.2s" }}>
                      {item.marcado?"✓":""}
                    </button>
                    <div style={{ flex:1,minWidth:0 }}>
                      <span style={{ fontSize:14,fontWeight:700,color:item.marcado?"rgba(255,255,255,0.25)":"#f0f0f0",textDecoration:item.marcado?"line-through":"none" }}>{item.nome}</span>
                      {/* Detalhes do produto: marca, modelo, detalhe */}
                      {!item.marcado && (item.marca||item.modelo||item.detalhe) && (
                        <div style={{ display:"flex",flexWrap:"wrap",gap:"4px 8px",marginTop:4 }}>
                          {item.marca  && <span style={{ fontSize:11,background:"rgba(255,255,255,0.08)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:5,padding:"1px 7px",color:"rgba(255,255,255,0.65)",fontWeight:600 }}>{item.marca}</span>}
                          {item.modelo && <span style={{ fontSize:11,background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:5,padding:"1px 7px",color:"rgba(255,255,255,0.5)" }}>{item.modelo}</span>}
                          {item.detalhe&& <span style={{ fontSize:11,background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:5,padding:"1px 7px",color:"rgba(255,255,255,0.4)",fontStyle:"italic" }}>{item.detalhe}</span>}
                        </div>
                      )}
                      <div style={{ fontSize:11,color:"rgba(255,255,255,0.28)",marginTop:4 }}>
                        {item.marcado
                          ? `${item.quantidadeCompra??item.quantidade} ${item.unidade}${(item.precoCompra??item.preco)>0?` · R$ ${(item.precoCompra??item.preco).toFixed(2)}/un · R$ ${((item.precoCompra??item.preco)*(item.quantidadeCompra??item.quantidade)).toFixed(2)}`:""}`
                          : `${item.quantidadeCompra??item.quantidade} ${item.unidade}${item.preco>0?` · R$ ${item.preco.toFixed(2)}/un (est.)`:""}`
                        }
                      </div>
                    </div>
                    <button onClick={()=>setItemConfirmando(item)} style={{ background:`${cat.cor}18`,border:`1px solid ${cat.cor}33`,color:cat.cor,width:32,height:32,borderRadius:9,cursor:"pointer",fontSize:14,flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center",alignSelf:"flex-start",marginTop:2 }}>✎</button>
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        {/* Card de totais com economia */}
        {(totalCarrinho>0||totalEstimado>0)&&(
          <div style={{ marginTop:12, borderRadius:20, overflow:"hidden", border:`1.5px solid ${economia?"rgba(16,185,129,0.35)":gastouMais?"rgba(239,68,68,0.3)":"rgba(255,255,255,0.1)"}`, background: economia?"rgba(16,185,129,0.07)":gastouMais?"rgba(239,68,68,0.07)":"rgba(255,255,255,0.04)" }}>

            {/* Linha principal: estimado × carrinho */}
            <div style={{ display:"flex", padding:"18px 20px 14px", gap:8 }}>
              {/* Estimado */}
              <div style={{ flex:1, borderRight:"1px solid rgba(255,255,255,0.08)", paddingRight:16 }}>
                <div style={{ fontSize:10,color:"rgba(255,255,255,0.35)",fontWeight:800,textTransform:"uppercase",letterSpacing:.8,marginBottom:4 }}>
                  📋 Previsão
                </div>
                <div style={{ fontSize:11,color:"rgba(255,255,255,0.35)",marginBottom:2 }}>
                  {itensCompra.filter(i=>i.preco>0).length} itens c/ preço
                </div>
                <div style={{ fontSize:26,fontWeight:900,fontFamily:"'Plus Jakarta Sans',sans-serif",color:"rgba(255,255,255,0.65)",lineHeight:1 }}>
                  {totalEstimado>0 ? `R$ ${totalEstimado.toFixed(2)}` : "—"}
                </div>
              </div>

              {/* Carrinho */}
              <div style={{ flex:1, paddingLeft:16 }}>
                <div style={{ fontSize:10,color:"rgba(255,255,255,0.35)",fontWeight:800,textTransform:"uppercase",letterSpacing:.8,marginBottom:4 }}>
                  🛒 No carrinho
                </div>
                <div style={{ fontSize:11,color:"rgba(255,255,255,0.35)",marginBottom:2 }}>
                  {marcados.length} de {itensCompra.length} confirmados
                </div>
                <div style={{ fontSize:26,fontWeight:900,fontFamily:"'Plus Jakarta Sans',sans-serif",color:economia?"#34d399":gastouMais?"#f87171":"#fff",lineHeight:1 }}>
                  R$ {totalCarrinho.toFixed(2)}
                </div>
              </div>
            </div>

            {/* Faixa de economia/prejuízo — só aparece quando há itens marcados E preço estimado */}
            {totalCarrinho>0 && totalEstimado>0 && (
              <div style={{ borderTop:`1px solid ${economia?"rgba(16,185,129,0.2)":gastouMais?"rgba(239,68,68,0.2)":"rgba(255,255,255,0.07)"}`, padding:"12px 20px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                  <div style={{ fontSize:24 }}>
                    {economia ? "🎉" : gastouMais ? "⚠️" : "✅"}
                  </div>
                  <div>
                    <div style={{ fontSize:13,fontWeight:800,color: economia?"#34d399":gastouMais?"#f87171":"rgba(255,255,255,0.6)" }}>
                      {economia ? "Você economizou!" : gastouMais ? "Gastou um pouco mais" : "Exatamente o previsto"}
                    </div>
                    <div style={{ fontSize:11,color:"rgba(255,255,255,0.35)",marginTop:2 }}>
                      {economia
                        ? `R$ ${Math.abs(diferenca).toFixed(2)} abaixo da previsão`
                        : gastouMais
                        ? `R$ ${Math.abs(diferenca).toFixed(2)} acima da previsão`
                        : "Previsão perfeita 👌"}
                    </div>
                  </div>
                </div>
                {/* Percentual de variação */}
                {totalEstimado>0 && (
                  <div style={{ textAlign:"right", flexShrink:0 }}>
                    <div style={{ fontSize:22,fontWeight:900,fontFamily:"'Plus Jakarta Sans',sans-serif",color: economia?"#34d399":gastouMais?"#f87171":"rgba(255,255,255,0.5)" }}>
                      {economia ? "-" : gastouMais ? "+" : ""}{Math.abs((diferenca/totalEstimado)*100).toFixed(1)}%
                    </div>
                    <div style={{ fontSize:10,color:"rgba(255,255,255,0.3)",fontWeight:700 }}>variação</div>
                  </div>
                )}
              </div>
            )}

            {/* Aviso quando ainda há itens não marcados */}
            {marcados.length < itensCompra.length && totalCarrinho>0 && (
              <div style={{ borderTop:"1px solid rgba(255,255,255,0.06)", padding:"9px 20px", fontSize:11, color:"rgba(255,255,255,0.3)", display:"flex", alignItems:"center", gap:6 }}>
                <span>⏳</span> {itensCompra.length - marcados.length} {itensCompra.length-marcados.length===1?"item ainda não confirmado":"itens ainda não confirmados"} — total parcial
              </div>
            )}
          </div>
        )}
        <div style={{ height:40 }} />
      </div>
    </div>
  );
}


// ─── Helpers de data ──────────────────────────────────────────────────────────
const fmtData   = (iso) => new Date(iso).toLocaleDateString("pt-BR",{day:"2-digit",month:"2-digit",year:"2-digit"});
const fmtHora   = (iso) => new Date(iso).toLocaleTimeString("pt-BR",{hour:"2-digit",minute:"2-digit"});
const isoSemana = (iso) => {
  const d = new Date(iso);
  const jan1 = new Date(d.getFullYear(),0,1);
  return Math.ceil(((d-jan1)/86400000+jan1.getDay()+1)/7);
};
const isoMes = (iso) => {
  const d = new Date(iso);
  return `${String(d.getMonth()+1).padStart(2,"0")}/${d.getFullYear()}`;
};
const labelSemana = (iso) => {
  const d  = new Date(iso);
  const ini = new Date(d); ini.setDate(d.getDate()-d.getDay());
  const fim = new Date(ini); fim.setDate(ini.getDate()+6);
  return `${ini.getDate()}/${ini.getMonth()+1}–${fim.getDate()}/${fim.getMonth()+1}`;
};

// ─── TELA: Resumo pós-compra ──────────────────────────────────────────────────
function TelaResumoCompra({ registro, onVerHistorico, onVoltar }) {
  if (!registro) { onVoltar(); return null; }
  const eco     = registro.economia;
  const positivo = eco >= 0;
  const pct      = registro.estimado > 0 ? Math.abs(eco/registro.estimado*100).toFixed(1) : 0;

  return (
    <div style={{ minHeight:"100vh", background:"linear-gradient(160deg,#0f0c29,#1a1a2e,#16213e)", fontFamily:"'Plus Jakarta Sans',sans-serif", color:"#f0f0f0", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:28 }}>
      <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800;900&display=swap" rel="stylesheet"/>
      <style>{`@keyframes popIn{0%{transform:scale(0.6);opacity:0}70%{transform:scale(1.1)}100%{transform:scale(1);opacity:1}} @keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}`}</style>

      {/* Ícone animado */}
      <div style={{ fontSize:72, marginBottom:20, animation:"popIn 0.5s cubic-bezier(.34,1.56,.64,1) forwards" }}>
        {positivo ? "🎉" : "📊"}
      </div>

      <div style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontWeight:800, fontSize:26, marginBottom:6, textAlign:"center", animation:"fadeUp 0.4s 0.1s both" }}>
        Compra finalizada!
      </div>
      <div style={{ fontSize:14, color:"rgba(255,255,255,0.45)", marginBottom:32, textAlign:"center", animation:"fadeUp 0.4s 0.15s both" }}>
        {fmtData(registro.data)} às {fmtHora(registro.data)} · {registro.itensCont} itens
      </div>

      {/* Card principal */}
      <div style={{ width:"100%", maxWidth:400, background:"rgba(255,255,255,0.05)", border:`1.5px solid ${positivo?"rgba(16,185,129,0.35)":"rgba(239,68,68,0.3)"}`, borderRadius:24, overflow:"hidden", marginBottom:20, animation:"fadeUp 0.4s 0.2s both" }}>

        {/* Linha pago × estimado */}
        <div style={{ display:"flex", padding:"22px 22px 16px" }}>
          <div style={{ flex:1, borderRight:"1px solid rgba(255,255,255,0.08)", paddingRight:18 }}>
            <div style={{ fontSize:10, color:"rgba(255,255,255,0.35)", fontWeight:800, textTransform:"uppercase", letterSpacing:.8, marginBottom:6 }}>📋 Previsão</div>
            <div style={{ fontSize:28, fontWeight:900, fontFamily:"'Plus Jakarta Sans',sans-serif", color:"rgba(255,255,255,0.55)" }}>
              R$ {registro.estimado.toFixed(2)}
            </div>
          </div>
          <div style={{ flex:1, paddingLeft:18 }}>
            <div style={{ fontSize:10, color:"rgba(255,255,255,0.35)", fontWeight:800, textTransform:"uppercase", letterSpacing:.8, marginBottom:6 }}>🛒 Pago</div>
            <div style={{ fontSize:28, fontWeight:900, fontFamily:"'Plus Jakarta Sans',sans-serif", color: positivo?"#34d399":"#f87171" }}>
              R$ {registro.pago.toFixed(2)}
            </div>
          </div>
        </div>

        {/* Faixa economia */}
        <div style={{ background: positivo?"rgba(16,185,129,0.12)":"rgba(239,68,68,0.1)", borderTop:`1px solid ${positivo?"rgba(16,185,129,0.2)":"rgba(239,68,68,0.2)"}`, padding:"14px 22px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <div>
            <div style={{ fontSize:14, fontWeight:800, color: positivo?"#34d399":"#f87171" }}>
              {positivo ? `Economizou R$ ${eco.toFixed(2)}` : `Gastou R$ ${Math.abs(eco).toFixed(2)} a mais`}
            </div>
            <div style={{ fontSize:11, color:"rgba(255,255,255,0.35)", marginTop:2 }}>
              {positivo ? "abaixo da previsão" : "acima da previsão"}
            </div>
          </div>
          <div style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontWeight:900, fontSize:26, color: positivo?"#34d399":"#f87171" }}>
            {positivo?"-":"+"}{pct}%
          </div>
        </div>
      </div>

      {/* Botões */}
      <div style={{ width:"100%", maxWidth:400, display:"flex", flexDirection:"column", gap:10, animation:"fadeUp 0.4s 0.3s both" }}>
        <button onClick={onVerHistorico} style={{ width:"100%", background:"linear-gradient(135deg,#6366f1,#8B5CF6)", border:"none", borderRadius:16, padding:"16px", color:"#fff", fontWeight:900, fontSize:15, cursor:"pointer", fontFamily:"'Plus Jakarta Sans',sans-serif", display:"flex", alignItems:"center", justifyContent:"center", gap:10 }}>
          📊 Ver histórico e gráficos
        </button>
        <button onClick={onVoltar} style={{ width:"100%", background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:16, padding:"14px", color:"rgba(255,255,255,0.6)", fontWeight:700, fontSize:14, cursor:"pointer", fontFamily:"'Plus Jakarta Sans',sans-serif" }}>
          Voltar ao início
        </button>
      </div>
    </div>
  );
}

// ─── Tooltip customizado para os gráficos ─────────────────────────────────────
function TooltipCustom({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  const d = payload[0]?.payload;
  return (
    <div style={{ background:"#1e1e3a", border:"1px solid rgba(255,255,255,0.15)", borderRadius:12, padding:"10px 14px", fontSize:12, fontFamily:"'Plus Jakarta Sans',sans-serif", color:"#fff" }}>
      <div style={{ fontWeight:800, marginBottom:4 }}>{label}</div>
      {payload.map((p,i) => (
        <div key={i} style={{ color:p.color, fontWeight:700 }}>{p.name}: R$ {Number(p.value).toFixed(2)}</div>
      ))}
      {d?.economia != null && (
        <div style={{ marginTop:4, color: d.economia>=0?"#34d399":"#f87171", fontWeight:700 }}>
          {d.economia>=0 ? `Economia: R$ ${d.economia.toFixed(2)}` : `A mais: R$ ${Math.abs(d.economia).toFixed(2)}`}
        </div>
      )}
    </div>
  );
}

// ─── TELA: Histórico com gráficos ─────────────────────────────────────────────
function TelaHistorico({ historico, onVoltar, onZerarHistorico }) {
  const [aba, setAba]               = useState("semana"); // "semana" | "mes" | "lista"
  const [registroDetalhe, setRegistroDetalhe] = useState(null); // modal de detalhes
  const [confirmarZerar,  setConfirmarZerar]  = useState(false);

  // Calcula meses de dados acumulados
  const maisAntigo = historico.length > 0 ? new Date(historico[0].data) : null;
  const mesesAcum  = maisAntigo ? Math.floor((Date.now() - maisAntigo) / (1000*60*60*24*30)) : 0;

  // ── Agrupa por semana ──────────────────────────────────────────────────────
  const dadosSemana = useMemo(() => {
    const mapa = {};
    historico.forEach(r => {
      const key = labelSemana(r.data);
      if (!mapa[key]) mapa[key] = { label:key, estimado:0, pago:0, economia:0, compras:0 };
      mapa[key].estimado += r.estimado;
      mapa[key].pago     += r.pago;
      mapa[key].economia += r.economia;
      mapa[key].compras  += 1;
    });
    return Object.values(mapa).slice(-8); // últimas 8 semanas
  }, [historico]);

  // ── Agrupa por mês ─────────────────────────────────────────────────────────
  const dadosMes = useMemo(() => {
    const mapa = {};
    historico.forEach(r => {
      const key = isoMes(r.data);
      if (!mapa[key]) mapa[key] = { label:key, estimado:0, pago:0, economia:0, compras:0 };
      mapa[key].estimado += r.estimado;
      mapa[key].pago     += r.pago;
      mapa[key].economia += r.economia;
      mapa[key].compras  += 1;
    });
    return Object.values(mapa).slice(-6); // últimos 6 meses
  }, [historico]);

  const dados = aba === "mes" ? dadosMes : dadosSemana;
  const totalPago     = historico.reduce((a,r)=>a+r.pago,0);
  const totalEco      = historico.reduce((a,r)=>a+r.economia,0);
  const mediaCompra   = historico.length > 0 ? totalPago/historico.length : 0;
  const BASE_STYLE    = { minHeight:"100vh", background:"linear-gradient(160deg,#0f0c29,#1a1a2e,#16213e)", fontFamily:"'Plus Jakarta Sans',sans-serif", color:"#f0f0f0" };

  if (historico.length === 0) return (
    <div style={{ ...BASE_STYLE, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:32 }}>
      <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800;900&display=swap" rel="stylesheet"/>
      <div style={{ fontSize:56, marginBottom:16 }}>📊</div>
      <div style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontWeight:800, fontSize:22, marginBottom:10 }}>Nenhuma compra registrada</div>
      <div style={{ fontSize:14, color:"rgba(255,255,255,0.4)", marginBottom:28, textAlign:"center" }}>Finalize sua primeira compra para ver os gráficos aqui.</div>
      <button onClick={onVoltar} style={{ background:"rgba(255,255,255,0.07)", border:"1px solid rgba(255,255,255,0.12)", borderRadius:14, padding:"14px 28px", color:"rgba(255,255,255,0.7)", fontWeight:700, fontSize:14, cursor:"pointer" }}>← Voltar</button>
    </div>
  );

  return (
    <div style={BASE_STYLE}>
      <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800;900&display=swap" rel="stylesheet"/>
      <style>{`@keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}} @keyframes slideUp{from{opacity:0;transform:translateY(40px)}to{opacity:1;transform:translateY(0)}}`}</style>

      {/* Modal: detalhes da compra */}
      {registroDetalhe && (
        <div onClick={()=>setRegistroDetalhe(null)} style={{ position:"fixed",inset:0,background:"rgba(0,0,0,0.7)",zIndex:500,display:"flex",alignItems:"flex-end",justifyContent:"center" }}>
          <div onClick={e=>e.stopPropagation()} style={{ background:"#1a1a2e",borderRadius:"24px 24px 0 0",padding:"24px 20px 40px",width:"100%",maxWidth:660,maxHeight:"75vh",overflowY:"auto",animation:"slideUp 0.25s ease" }}>
            <div style={{ fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:800,fontSize:18,marginBottom:4 }}>
              🛒 Compra de {new Date(registroDetalhe.data).toLocaleDateString("pt-BR",{day:"2-digit",month:"long",year:"numeric"})}
            </div>
            <div style={{ fontSize:12,color:"rgba(255,255,255,0.4)",marginBottom:20 }}>
              {registroDetalhe.itensCont} itens · Pago R$ {registroDetalhe.pago.toFixed(2)} · {registroDetalhe.economia>=0?"Economia":"Prejuízo"} R$ {Math.abs(registroDetalhe.economia).toFixed(2)}
            </div>
            {(registroDetalhe.itens||[]).length > 0 ? (
              <div style={{ background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:14,overflow:"hidden" }}>
                {registroDetalhe.itens.map((it,i)=>(
                  <div key={i} style={{ display:"flex",justifyContent:"space-between",alignItems:"center",padding:"11px 16px",borderBottom:i<registroDetalhe.itens.length-1?"1px solid rgba(255,255,255,0.05)":"none" }}>
                    <div>
                      <div style={{ fontSize:13,fontWeight:700,color:"#e0e0e0" }}>{it.nome}{it.marca?` · ${it.marca}`:""}</div>
                      <div style={{ fontSize:11,color:"rgba(255,255,255,0.35)",marginTop:1 }}>{it.qtd} {it.unidade}</div>
                    </div>
                    <div style={{ textAlign:"right" }}>
                      <div style={{ fontSize:13,fontWeight:800,color:"#a5b4fc" }}>R$ {(it.preco*it.qtd).toFixed(2)}</div>
                      <div style={{ fontSize:10,color:"rgba(255,255,255,0.3)" }}>R$ {it.preco.toFixed(2)}/un</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ fontSize:13,color:"rgba(255,255,255,0.35)",textAlign:"center",padding:20 }}>
                Detalhes dos itens não disponíveis para compras antigas.
              </div>
            )}
            <button onClick={()=>setRegistroDetalhe(null)} style={{ width:"100%",marginTop:20,background:"rgba(255,255,255,0.07)",border:"1px solid rgba(255,255,255,0.12)",borderRadius:12,padding:"13px",color:"rgba(255,255,255,0.6)",fontWeight:700,fontSize:14,cursor:"pointer",fontFamily:"'Plus Jakarta Sans',sans-serif" }}>
              Fechar
            </button>
          </div>
        </div>
      )}

      {/* Modal: confirmar zerar histórico */}
      {confirmarZerar && (
        <div style={{ position:"fixed",inset:0,background:"rgba(0,0,0,0.7)",zIndex:500,display:"flex",alignItems:"center",justifyContent:"center",padding:20 }}>
          <div style={{ background:"#1a1a2e",borderRadius:20,padding:28,width:"100%",maxWidth:380,animation:"slideUp 0.2s ease" }}>
            <div style={{ fontSize:36,marginBottom:12,textAlign:"center" }}>🗑️</div>
            <div style={{ fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:800,fontSize:18,marginBottom:8,textAlign:"center" }}>Zerar histórico?</div>
            <div style={{ fontSize:13,color:"rgba(255,255,255,0.5)",lineHeight:1.7,marginBottom:24,textAlign:"center" }}>
              Você tem <strong style={{color:"#fbbf24"}}>{mesesAcum} mese{mesesAcum!==1?"s":""}</strong> de dados acumulados. Isso apagará <strong style={{color:"#f87171"}}>{historico.length} registros</strong> permanentemente. Essa ação não pode ser desfeita.
            </div>
            <div style={{ display:"flex",gap:10 }}>
              <button onClick={()=>setConfirmarZerar(false)} style={{ flex:1,background:"rgba(255,255,255,0.07)",border:"1px solid rgba(255,255,255,0.12)",borderRadius:12,padding:"13px",color:"rgba(255,255,255,0.6)",fontWeight:700,fontSize:14,cursor:"pointer",fontFamily:"'Plus Jakarta Sans',sans-serif" }}>Cancelar</button>
              <button onClick={()=>{ onZerarHistorico(); setConfirmarZerar(false); }} style={{ flex:1,background:"linear-gradient(135deg,#ef4444,#dc2626)",border:"none",borderRadius:12,padding:"13px",color:"#fff",fontWeight:800,fontSize:14,cursor:"pointer",fontFamily:"'Plus Jakarta Sans',sans-serif" }}>Apagar tudo</button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div style={{ background:"rgba(255,255,255,0.04)", backdropFilter:"blur(20px)", borderBottom:"1px solid rgba(255,255,255,0.08)", padding:"14px 20px", position:"sticky", top:0, zIndex:100 }}>
        <div style={{ maxWidth:680, margin:"0 auto", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <div>
            <div style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontWeight:800, fontSize:20 }}>📊 Histórico de Compras</div>
            <div style={{ fontSize:12, color:"rgba(255,255,255,0.4)", marginTop:2 }}>{historico.length} compra{historico.length!==1?"s":""} registrada{historico.length!==1?"s":""}</div>
          </div>
          <div style={{ display:"flex",gap:8 }}>
            {mesesAcum >= 3 && (
              <button onClick={()=>setConfirmarZerar(true)} style={{ background:"rgba(239,68,68,0.1)",border:"1px solid rgba(239,68,68,0.25)",borderRadius:10,padding:"8px 12px",color:"#f87171",fontSize:12,fontWeight:700,cursor:"pointer" }}>
                🗑️ Zerar
              </button>
            )}
            <button onClick={onVoltar} style={{ background:"rgba(255,255,255,0.07)", border:"1px solid rgba(255,255,255,0.12)", borderRadius:10, padding:"8px 14px", color:"rgba(255,255,255,0.6)", fontSize:13, fontWeight:700, cursor:"pointer" }}>← Início</button>
          </div>
        </div>
      </div>

      <div style={{ maxWidth:680, margin:"0 auto", padding:"20px 16px" }}>

        {/* Cards de resumo geral */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:10, marginBottom:24 }}>
          {[
            { label:"Total gasto", valor:`R$ ${totalPago.toFixed(2)}`, cor:"#a5b4fc", emoji:"🛒" },
            { label:"Total economizado", valor: totalEco>=0 ? `R$ ${totalEco.toFixed(2)}` : `-R$ ${Math.abs(totalEco).toFixed(2)}`, cor: totalEco>=0?"#34d399":"#f87171", emoji: totalEco>=0?"💰":"📉" },
            { label:"Média por compra", valor:`R$ ${mediaCompra.toFixed(2)}`, cor:"#fbbf24", emoji:"📋" },
          ].map((c,i) => (
            <div key={i} style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:14, padding:"12px 14px", animation:`fadeIn ${0.1+i*0.06}s ease` }}>
              <div style={{ fontSize:18, marginBottom:4 }}>{c.emoji}</div>
              <div style={{ fontSize:10, color:"rgba(255,255,255,0.35)", fontWeight:700, textTransform:"uppercase", letterSpacing:.6, marginBottom:4 }}>{c.label}</div>
              <div style={{ fontSize:15, fontWeight:900, fontFamily:"'Plus Jakarta Sans',sans-serif", color:c.cor, lineHeight:1 }}>{c.valor}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ display:"flex", background:"rgba(255,255,255,0.05)", borderRadius:12, padding:4, marginBottom:20, gap:4 }}>
          {[["semana","📅 Semanal"],["mes","🗓️ Mensal"],["lista","📋 Compras"]].map(([val,lbl]) => (
            <button key={val} onClick={()=>setAba(val)}
              style={{ flex:1, padding:"10px 6px", borderRadius:9, border:"none", background: aba===val?"rgba(99,102,241,0.35)":"transparent", color: aba===val?"#fff":"rgba(255,255,255,0.4)", fontWeight:800, fontSize:12, cursor:"pointer", fontFamily:"'Plus Jakarta Sans',sans-serif", transition:"all 0.2s" }}>
              {lbl}
            </button>
          ))}
        </div>

        {/* ── Gráfico Semanal / Mensal ─────────────────────────────────────── */}
        {aba !== "lista" && (
          <div style={{ animation:"fadeIn 0.3s ease" }}>

            {/* Gráfico: Pago vs Estimado */}
            <div style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:18, padding:"18px 16px 10px", marginBottom:16 }}>
              <div style={{ fontSize:12, fontWeight:800, color:"rgba(255,255,255,0.5)", textTransform:"uppercase", letterSpacing:.8, marginBottom:16 }}>
                💳 Gasto {aba==="mes"?"por mês":"por semana"} — Pago vs Previsto
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={dados} barGap={3} margin={{ top:4, right:8, left:-10, bottom:4 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
                  <XAxis dataKey="label" tick={{ fill:"rgba(255,255,255,0.4)", fontSize:10, fontFamily:"Plus Jakarta Sans" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill:"rgba(255,255,255,0.3)", fontSize:10 }} axisLine={false} tickLine={false} tickFormatter={v=>`R$${v}`} />
                  <Tooltip content={<TooltipCustom/>} cursor={{ fill:"rgba(255,255,255,0.04)" }} />
                  <Bar dataKey="estimado" name="Previsto" fill="rgba(165,180,252,0.35)" radius={[5,5,0,0]} maxBarSize={28} />
                  <Bar dataKey="pago" name="Pago" radius={[5,5,0,0]} maxBarSize={28}>
                    {dados.map((d,i) => <Cell key={i} fill={d.economia>=0?"#10B981":"#ef4444"} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              <div style={{ display:"flex", gap:16, justifyContent:"center", marginTop:8 }}>
                {[["rgba(165,180,252,0.6)","Previsto"],["#10B981","Pago (economia)"],["#ef4444","Pago (a mais)"]].map(([cor,txt])=>(
                  <div key={txt} style={{ display:"flex", alignItems:"center", gap:5, fontSize:10, color:"rgba(255,255,255,0.4)" }}>
                    <div style={{ width:10, height:10, borderRadius:3, background:cor }} />{txt}
                  </div>
                ))}
              </div>
            </div>

            {/* Gráfico: Economia/Prejuízo */}
            <div style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:18, padding:"18px 16px 10px", marginBottom:16 }}>
              <div style={{ fontSize:12, fontWeight:800, color:"rgba(255,255,255,0.5)", textTransform:"uppercase", letterSpacing:.8, marginBottom:16 }}>
                💰 Economia ou Prejuízo {aba==="mes"?"por mês":"por semana"}
              </div>
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={dados} margin={{ top:4, right:8, left:-10, bottom:4 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
                  <XAxis dataKey="label" tick={{ fill:"rgba(255,255,255,0.4)", fontSize:10 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill:"rgba(255,255,255,0.3)", fontSize:10 }} axisLine={false} tickLine={false} tickFormatter={v=>`R$${v}`} />
                  <Tooltip content={<TooltipCustom/>} cursor={{ fill:"rgba(255,255,255,0.04)" }} />
                  <ReferenceLine y={0} stroke="rgba(255,255,255,0.2)" strokeDasharray="4 4" />
                  <Bar dataKey="economia" name="Variação" radius={[5,5,0,0]} maxBarSize={28}>
                    {dados.map((d,i) => <Cell key={i} fill={d.economia>=0?"#10B981":"#ef4444"} fillOpacity={0.85} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              <div style={{ display:"flex", gap:16, justifyContent:"center", marginTop:8 }}>
                {[["#10B981","Economizou"],["#ef4444","Gastou a mais"]].map(([cor,txt])=>(
                  <div key={txt} style={{ display:"flex", alignItems:"center", gap:5, fontSize:10, color:"rgba(255,255,255,0.4)" }}>
                    <div style={{ width:10, height:10, borderRadius:3, background:cor }} />{txt}
                  </div>
                ))}
              </div>
            </div>

            {/* Totais do período visível */}
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:8 }}>
              {[
                { label:`Total pago (${aba==="mes"?"meses":"semanas"} visíveis)`, valor:`R$ ${dados.reduce((a,d)=>a+d.pago,0).toFixed(2)}`, cor:"#fff" },
                { label:"Economia acumulada", valor:(() => { const e=dados.reduce((a,d)=>a+d.economia,0); return `${e>=0?"":"- "}R$ ${Math.abs(e).toFixed(2)}`; })(), cor: dados.reduce((a,d)=>a+d.economia,0)>=0?"#34d399":"#f87171" },
              ].map((c,i)=>(
                <div key={i} style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:12, padding:"12px 16px" }}>
                  <div style={{ fontSize:10, color:"rgba(255,255,255,0.35)", fontWeight:700, textTransform:"uppercase", marginBottom:4 }}>{c.label}</div>
                  <div style={{ fontSize:18, fontWeight:900, fontFamily:"'Plus Jakarta Sans',sans-serif", color:c.cor }}>{c.valor}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Lista de compras ─────────────────────────────────────────────── */}
        {aba === "lista" && (
          <div style={{ animation:"fadeIn 0.3s ease" }}>
            <div style={{ fontSize:11,color:"rgba(255,255,255,0.3)",marginBottom:12,textAlign:"center" }}>Toque em uma compra para ver os itens detalhados</div>
            {[...historico].reverse().map((r,i) => {
              const eco = r.economia;
              const pos = eco >= 0;
              const temItens = r.itens && r.itens.length > 0;
              return (
                <div key={r.id} onClick={()=>setRegistroDetalhe(r)}
                  style={{ background:"rgba(255,255,255,0.04)", border:`1px solid ${pos?"rgba(16,185,129,0.15)":"rgba(239,68,68,0.15)"}`, borderRadius:14, padding:"14px 18px", marginBottom:10, display:"flex", justifyContent:"space-between", alignItems:"center", animation:`fadeIn ${0.1+i*0.04}s ease`, cursor:"pointer" }}
                  onMouseEnter={e=>e.currentTarget.style.background="rgba(255,255,255,0.07)"}
                  onMouseLeave={e=>e.currentTarget.style.background="rgba(255,255,255,0.04)"}>
                  <div>
                    <div style={{ fontSize:13, fontWeight:800, color:"#fff", marginBottom:3 }}>{fmtData(r.data)}</div>
                    <div style={{ fontSize:11, color:"rgba(255,255,255,0.4)" }}>{fmtHora(r.data)} · {r.itensCont} itens · est. R$ {r.estimado.toFixed(2)}</div>
                    {temItens && <div style={{ fontSize:10, color:"rgba(99,102,241,0.7)", marginTop:3, fontWeight:700 }}>📋 Ver itens →</div>}
                  </div>
                  <div style={{ textAlign:"right" }}>
                    <div style={{ fontSize:18, fontWeight:900, fontFamily:"'Plus Jakarta Sans',sans-serif", color:"#fff" }}>R$ {r.pago.toFixed(2)}</div>
                    <div style={{ fontSize:11, fontWeight:700, color: pos?"#34d399":"#f87171" }}>
                      {pos ? `▼ R$ ${eco.toFixed(2)}` : `▲ R$ ${Math.abs(eco).toFixed(2)}`}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div style={{ height:40 }} />
      </div>
    </div>
  );
}

// ─── APP ROOT ─────────────────────────────────────────────────────────────────
export default function App() {
  // ── Persistência localStorage ────────────────────────────────────────────────
  const [itens, setItensRaw] = useState(() => {
    try {
      const saved = localStorage.getItem("lc_itens");
      return saved ? JSON.parse(saved) : listaComIds;
    } catch { return listaComIds; }
  });
  const setItens = (updater) => {
    setItensRaw(prev => {
      const next = typeof updater === "function" ? updater(prev) : updater;
      try { localStorage.setItem("lc_itens", JSON.stringify(next)); } catch {}
      return next;
    });
  };

  const [selecionados, setSelecionadosRaw] = useState(() => {
    try {
      const saved = localStorage.getItem("lc_selecionados");
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });
  const setSelecionados = (updater) => {
    setSelecionadosRaw(prev => {
      const next = typeof updater === "function" ? updater(prev) : updater;
      try { localStorage.setItem("lc_selecionados", JSON.stringify(next)); } catch {}
      return next;
    });
  };

  const [historico, setHistoricoRaw] = useState(() => {
    try {
      const saved = localStorage.getItem("lc_historico");
      if (saved) return JSON.parse(saved);
    } catch {}
    // Dados de demonstração na primeira vez
    const hoje = new Date();
    const semanas = [
      { diasAtras:49, estimado:187.50, pago:174.20 },
      { diasAtras:42, estimado:203.00, pago:215.80 },
      { diasAtras:35, estimado:165.00, pago:158.40 },
      { diasAtras:28, estimado:220.00, pago:198.60 },
      { diasAtras:21, estimado:195.50, pago:201.30 },
      { diasAtras:14, estimado:178.00, pago:162.90 },
      { diasAtras: 7, estimado:210.00, pago:204.50 },
    ];
    return semanas.map((s, i) => {
      const d = new Date(hoje); d.setDate(hoje.getDate() - s.diasAtras);
      return { id: i+1, data: d.toISOString(), estimado: s.estimado, pago: s.pago, itensCont: Math.floor(8+Math.random()*6), economia: s.estimado - s.pago };
    });
  });
  const setHistorico = (updater) => {
    setHistoricoRaw(prev => {
      const next = typeof updater === "function" ? updater(prev) : updater;
      try { localStorage.setItem("lc_historico", JSON.stringify(next)); } catch {}
      return next;
    });
  };

  const [tela, setTela] = useState("home");
  const [registroAtual, setRegistroAtual] = useState(null);

  // Rascunho: lista preparada mas ainda nao foi para o mercado
  const temRascunho = selecionados.length > 0;

  const irParaPreparar = (novaLista = false) => {
    if (novaLista) {
      setItens(prev=>prev.map(i=>({...i,marcado:false,quantidadeCompra:undefined,precoCompra:undefined})));
      setSelecionados([]);
    }
    setTela("preparar");
  };

  const zerarHistorico = () => {
    setHistorico([]);
  };

  const importarLista = (data) => {
    // Mescla os itens importados nos itens existentes (matching por nome+marca)
    // e cria selecionados com as quantidades da lista recebida
    let novosSelecionados = [];
    setItens(prev => {
      const novos = [...prev];
      data.itens.forEach(imp => {
        const idx = novos.findIndex(i =>
          i.nome.toLowerCase()===imp.nome.toLowerCase() &&
          (i.marca||"").toLowerCase()===(imp.marca||"").toLowerCase()
        );
        if(idx >= 0) {
          // item já existe — só atualiza a quantidadeCompra
          novos[idx] = { ...novos[idx], quantidadeCompra: imp.quantidade };
          novosSelecionados.push(novos[idx].id);
        } else {
          // item novo — adiciona à lista base e seleciona
          const novoId = proximoId++;
          novos.push({
            id: novoId, nome: imp.nome, marca: imp.marca||"", modelo: imp.modelo||"",
            unidade: imp.unidade||"un", quantidade: imp.quantidade, quantidadeCompra: imp.quantidade,
            preco: imp.preco||0, categoria: imp.categoria||"alimentacao", detalhe:""
          });
          novosSelecionados.push(novoId);
        }
      });
      return novos;
    });
    setSelecionados(novosSelecionados);
    setTela("comprando");
  };
  const irComprar         = () => setTela("comprando");
  const voltarBase        = () => setTela("base");
  const voltarHome        = () => setTela("home");
  const voltarPreparar    = () => setTela("preparar");

  const encerrar = (totais) => {
    if (totais && totais.pago > 0) {
      // Captura snapshot dos itens comprados com detalhes
      const itensComprados = itens
        .filter(i => selecionados.includes(i.id))
        .map(i => ({
          nome:       i.nome,
          marca:      i.marca || "",
          unidade:    i.unidade,
          qtd:        i.quantidadeCompra ?? i.quantidade,
          preco:      i.precoCompra ?? i.preco ?? 0,
          categoria:  i.categoria,
        }));
      const registro = {
        id:        Date.now(),
        data:      new Date().toISOString(),
        estimado:  totais.estimado,
        pago:      totais.pago,
        itensCont: totais.itensCont,
        economia:  totais.estimado - totais.pago,
        itens:     itensComprados,
      };
      setRegistroAtual(registro);
      // Manter apenas últimos 12 meses e no máximo 200 registros
      const limite = new Date();
      limite.setFullYear(limite.getFullYear() - 1);
      setHistorico(prev => {
        const filtrado = prev.filter(r => new Date(r.data) >= limite);
        return [...filtrado, registro].slice(-200);
      });
      setTela("resumo");
    } else {
      setTela("base");
    }
    setItens(prev=>prev.map(i=>({...i,marcado:false,quantidadeCompra:undefined,precoCompra:undefined})));
    setSelecionados([]);
  };

  if(tela==="home")        return <TelaHome            itens={itens} historico={historico} temRascunho={temRascunho} selecionados={selecionados} onIrListaBase={()=>setTela("base")} onIrPreparar={()=>irParaPreparar(false)} onIrComprar={irLocalizarPrecos} onIrHistorico={()=>setTela("historico")} onIrLocalizacao={()=>setTela("localizando")} onImportarLista={importarLista} />;
  if(tela==="base")        return <TelaListaBase        itens={itens} setItens={setItens} onIrParaPreparar={irParaPreparar} onVerHistorico={()=>setTela("historico")} historico={historico} temRascunho={temRascunho} onVoltar={voltarHome} />;
  if(tela==="preparar")    return <TelaPreparar          itens={itens} setItens={setItens} selecionados={selecionados} setSelecionados={setSelecionados} onVoltar={voltarHome} onIrComprar={irLocalizarPrecos} />;
  if(tela==="localizando") return <TelaSupermercados     itens={itens} selecionados={selecionados} onPular={irComprar} onVoltar={()=>setTela("home")} />;
  if(tela==="comprando")   return <TelaComprando         itens={itens} selecionados={selecionados} setItens={setItens} onVoltar={voltarPreparar} onEncerrar={encerrar} />;
  if(tela==="resumo")      return <TelaResumoCompra      registro={registroAtual} onVerHistorico={()=>setTela("historico")} onVoltar={voltarHome} />;
  if(tela==="historico")   return <TelaHistorico         historico={historico} onVoltar={voltarHome} onZerarHistorico={zerarHistorico} />;
}
