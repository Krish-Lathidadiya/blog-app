import React from "react";
import { Link } from "react-router-dom";
import {
  Footer,
  FooterCopyright,
  FooterDivider,
  FooterIcon,
  FooterLink,
  FooterLinkGroup,
  FooterTitle,
} from "flowbite-react";
import { BsFacebook, BsGithub, BsTwitter, BsInstagram } from "react-icons/bs";

function FooterCom() {
  return (
    <Footer
      container
      className="border border-t-8 border-teal-500 font-semibold"
    >
      <div className="w-full max-w-7xl mx-auto p-6">
        <div>
          <Link
            to="/"
            className="self-center whitespace-nowrap text-xl font-bold dark:text-white"
          >
            <span className="px-3 py-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white tracking-wider">
              KRISH's
            </span>
            Blog
          </Link>
        </div>
        <div className="grid gap-6 mt-6 sm:grid-cols-2 md:grid-cols-3">
          <div>
            <FooterTitle title="About" />
            <FooterLinkGroup col>
              <FooterLink
                href="https://www.100jsprojects.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                100 JS Project
              </FooterLink>
              <FooterLink href="#" target="_blank" rel="noopener noreferrer">
                Krish's Blog
              </FooterLink>
            </FooterLinkGroup>
          </div>

          <div>
            <FooterTitle title="Follow Us" />
            <FooterLinkGroup col>
              <FooterLink href="#" target="_blank" rel="noopener noreferrer">
                Github
              </FooterLink>
              <FooterLink href="#" target="_blank" rel="noopener noreferrer">
                Discord
              </FooterLink>
            </FooterLinkGroup>
          </div>

          <div>
            <FooterTitle title="Legal" />
            <FooterLinkGroup col>
              <FooterLink href="#" target="_blank" rel="noopener noreferrer">
                Privacy Policy
              </FooterLink>
              <FooterLink href="#" target="_blank" rel="noopener noreferrer">
                Terms &amp; Conditions
              </FooterLink>
            </FooterLinkGroup>
          </div>
        </div>
        <FooterDivider />
        <div className="flex flex-col items-center justify-between sm:flex-row mt-6">
          <FooterCopyright
            href="#"
            by="Krish's blog"
            year={new Date().getFullYear()}
          />
          <div className="flex gap-5 justify-center mt-4 sm:mt-0">
            <FooterIcon href="#" icon={BsFacebook} />
            <FooterIcon href="#" icon={BsGithub} />
            <FooterIcon href="#" icon={BsTwitter} />
            <FooterIcon href="#" icon={BsInstagram} />
          </div>
        </div>
      </div>
    </Footer>
  );
}

export default FooterCom;
