export default function MejaInputs({ mejaProps = {}, setMejaProp, disabled = false }) {
  const { noMeja = '', nama = '' } = mejaProps;
  
  return (
      <>
          <label>No Meja</label>
          <input
              disabled={disabled}
              type="tel" placeholder="Nomer Meja"
              value={noMeja} 
              onChange={ev => setMejaProp('noMeja', ev.target.value)} 
          />
          <label>Nama</label>
          <input
              disabled={disabled}
              type="text" placeholder="Nama"
              value={nama} 
              onChange={ev => setMejaProp('nama', ev.target.value)}
          />
      </>
  );
}
