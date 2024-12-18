import React from "react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Router } from "next/router";

const Header = () => {
  let [State, setState] = useState(null);

  let SignOut = () => {
    localStorage.clear();
    setState(null);
  };

  useEffect(() => {
    setState(localStorage.getItem("User"));
  }, []);

  return (
    <div className="flex justify-between bg-[#34495e] text-[#ecf0f1] p-3">
      <div className="Left flex list-none space-x-3">
        <Link href="/">
          <li>Products from news</li>
        </Link>
        <Link href="/add-product">
          <li>Add Product list</li>
        </Link> 
      </div>
      <div className="Right flex list-none space-x-3">
        {!State ? (
          <>
            <Link href="/SignUp">
              <li>Sign Up</li>
            </Link>
            <Link href="/Login">
              <li>Log In</li>
            </Link>
          </>
        ) : (
          <li>{JSON.parse(State)?.Name}</li>
        )}

        {State ? (
          <>
            <li
              onClick={() => {
                SignOut();
              }}
            >
              Sign Out
            </li>
          </>
        ) : (
          <li>{JSON.parse(State)?.Name}</li>
        )}
      </div>
    </div>
  );
};

export default Header;
