import React from 'react';
import packageJson from '@/../package.json';

const SupabaseVersion = () => {
  const supabaseVersion = packageJson.dependencies['@supabase/supabase-js'];

  if (!supabaseVersion) {
    return null;
  }

  return (
    <div className="text-xs text-amber-100/50">
      <span>Supabase: v{supabaseVersion}</span>
    </div>
  );
};

export default SupabaseVersion;