function RoleSelect({role, setRole}) {
    return (
      <div className="my-4 w-full flex flex-col items-center">
        <label className="mb-2 text-center">Role:</label>
        <select 
          value={role}
          onChange={e => setRole(e.target.value)}
          className="border p-2 rounded w-full max-w-xs"
        >
          <option value="designer">Designer</option>
          <option value="developer">Developer</option>
          <option value="researcher">Researcher</option>
        </select>
      </div>
    );
  }
  
  export default RoleSelect;
  